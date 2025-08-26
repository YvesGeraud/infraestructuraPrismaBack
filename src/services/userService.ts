import { User, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../config/database";
import { PaginationParams, PaginatedResponse } from "../types";
import {
  CreateUserInput,
  UpdateUserInput,
  UserFiltersInput,
} from "../schemas/userSchemas";

// Tipo para respuesta de usuario (sin password)
export type UserResponse = Omit<User, "password">;

export class UserService {
  /**
   * Crear un nuevo usuario
   */
  async createUser(userData: CreateUserInput): Promise<UserResponse> {
    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    // Hashear la contraseña usando configuración centralizada
    const { bcryptConfig } = await import("../config/env");
    const hashedPassword = await bcrypt.hash(
      userData.password,
      bcryptConfig.rounds
    );

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || "USER",
      },
    });

    return this.mapToUserResponse(user);
  }

  /**
   * Obtener usuario por ID
   */
  async getUserById(id: number): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? this.mapToUserResponse(user) : null;
  }

  /**
   * Obtener usuario por email
   */
  async getUserByEmail(email: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user ? this.mapToUserResponse(user) : null;
  }

  /**
   * Obtener usuarios con paginación y filtros
   */
  async getUsers(
    filters: UserFiltersInput = {},
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<UserResponse>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    // Construir where clause
    const where: Prisma.UserWhereInput = {};

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.emailVerified !== undefined) {
      where.emailVerified = filters.emailVerified;
    }

    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search } },
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
      ];
    }

    // Obtener usuarios y total
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users.map((user) => this.mapToUserResponse(user)),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Actualizar usuario
   */
  async updateUser(
    id: number,
    userData: UpdateUserInput
  ): Promise<UserResponse> {
    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("Usuario no encontrado");
    }

    // Si se está actualizando el email, verificar que no exista
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (emailExists) {
        throw new Error("El email ya está registrado");
      }
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
    });

    return this.mapToUserResponse(updatedUser);
  }

  /**
   * Eliminar usuario (soft delete)
   */
  async deleteUser(id: number): Promise<void> {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("Usuario no encontrado");
    }

    // Soft delete - marcar como inactivo
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Verificar credenciales de usuario
   */
  async verifyCredentials(
    email: string,
    password: string
  ): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return null;
    }

    // Actualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return this.mapToUserResponse(user);
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("Contraseña actual incorrecta");
    }

    // Hashear nueva contraseña
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "12");
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword },
    });
  }

  /**
   * Mapear User de Prisma a UserResponse
   */
  private mapToUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
