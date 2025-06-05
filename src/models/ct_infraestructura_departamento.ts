import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ct_infraestructura_area, ct_infraestructura_areaId } from './ct_infraestructura_area';
import type { ct_infraestructura_direccion, ct_infraestructura_direccionId } from './ct_infraestructura_direccion';
import type { rl_infraestructura_edificios, rl_infraestructura_edificiosId } from './rl_infraestructura_edificios';

export interface ct_infraestructura_departamentoAttributes {
  id_departamento: number;
  nombre: string;
  id_puesto?: number;
  id_direccion?: number;
  estado?: number;
  fecha_in?: Date;
  fecha_at?: Date;
}

export type ct_infraestructura_departamentoPk = "id_departamento";
export type ct_infraestructura_departamentoId = ct_infraestructura_departamento[ct_infraestructura_departamentoPk];
export type ct_infraestructura_departamentoOptionalAttributes = "id_departamento" | "id_puesto" | "id_direccion" | "estado" | "fecha_in" | "fecha_at";
export type ct_infraestructura_departamentoCreationAttributes = Optional<ct_infraestructura_departamentoAttributes, ct_infraestructura_departamentoOptionalAttributes>;

export class ct_infraestructura_departamento extends Model<ct_infraestructura_departamentoAttributes, ct_infraestructura_departamentoCreationAttributes> implements ct_infraestructura_departamentoAttributes {
  id_departamento!: number;
  nombre!: string;
  id_puesto?: number;
  id_direccion?: number;
  estado?: number;
  fecha_in?: Date;
  fecha_at?: Date;

  // ct_infraestructura_departamento hasMany ct_infraestructura_area via id_departamento
  ct_infraestructura_areas!: ct_infraestructura_area[];
  getCt_infraestructura_areas!: Sequelize.HasManyGetAssociationsMixin<ct_infraestructura_area>;
  setCt_infraestructura_areas!: Sequelize.HasManySetAssociationsMixin<ct_infraestructura_area, ct_infraestructura_areaId>;
  addCt_infraestructura_area!: Sequelize.HasManyAddAssociationMixin<ct_infraestructura_area, ct_infraestructura_areaId>;
  addCt_infraestructura_areas!: Sequelize.HasManyAddAssociationsMixin<ct_infraestructura_area, ct_infraestructura_areaId>;
  createCt_infraestructura_area!: Sequelize.HasManyCreateAssociationMixin<ct_infraestructura_area>;
  removeCt_infraestructura_area!: Sequelize.HasManyRemoveAssociationMixin<ct_infraestructura_area, ct_infraestructura_areaId>;
  removeCt_infraestructura_areas!: Sequelize.HasManyRemoveAssociationsMixin<ct_infraestructura_area, ct_infraestructura_areaId>;
  hasCt_infraestructura_area!: Sequelize.HasManyHasAssociationMixin<ct_infraestructura_area, ct_infraestructura_areaId>;
  hasCt_infraestructura_areas!: Sequelize.HasManyHasAssociationsMixin<ct_infraestructura_area, ct_infraestructura_areaId>;
  countCt_infraestructura_areas!: Sequelize.HasManyCountAssociationsMixin;
  // ct_infraestructura_departamento hasMany rl_infraestructura_edificios via id_departamento
  rl_infraestructura_edificios!: rl_infraestructura_edificios[];
  getRl_infraestructura_edificios!: Sequelize.HasManyGetAssociationsMixin<rl_infraestructura_edificios>;
  setRl_infraestructura_edificios!: Sequelize.HasManySetAssociationsMixin<rl_infraestructura_edificios, rl_infraestructura_edificiosId>;
  addRl_infraestructura_edificio!: Sequelize.HasManyAddAssociationMixin<rl_infraestructura_edificios, rl_infraestructura_edificiosId>;
  addRl_infraestructura_edificios!: Sequelize.HasManyAddAssociationsMixin<rl_infraestructura_edificios, rl_infraestructura_edificiosId>;
  createRl_infraestructura_edificio!: Sequelize.HasManyCreateAssociationMixin<rl_infraestructura_edificios>;
  removeRl_infraestructura_edificio!: Sequelize.HasManyRemoveAssociationMixin<rl_infraestructura_edificios, rl_infraestructura_edificiosId>;
  removeRl_infraestructura_edificios!: Sequelize.HasManyRemoveAssociationsMixin<rl_infraestructura_edificios, rl_infraestructura_edificiosId>;
  hasRl_infraestructura_edificio!: Sequelize.HasManyHasAssociationMixin<rl_infraestructura_edificios, rl_infraestructura_edificiosId>;
  hasRl_infraestructura_edificios!: Sequelize.HasManyHasAssociationsMixin<rl_infraestructura_edificios, rl_infraestructura_edificiosId>;
  countRl_infraestructura_edificios!: Sequelize.HasManyCountAssociationsMixin;
  // ct_infraestructura_departamento belongsTo ct_infraestructura_direccion via id_direccion
  id_direccion_ct_infraestructura_direccion!: ct_infraestructura_direccion;
  getId_direccion_ct_infraestructura_direccion!: Sequelize.BelongsToGetAssociationMixin<ct_infraestructura_direccion>;
  setId_direccion_ct_infraestructura_direccion!: Sequelize.BelongsToSetAssociationMixin<ct_infraestructura_direccion, ct_infraestructura_direccionId>;
  createId_direccion_ct_infraestructura_direccion!: Sequelize.BelongsToCreateAssociationMixin<ct_infraestructura_direccion>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ct_infraestructura_departamento {
    return ct_infraestructura_departamento.init({
    id_departamento: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "nombre"
    },
    id_puesto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_direccion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ct_infraestructura_direccion',
        key: 'id_direccion'
      }
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    fecha_in: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    fecha_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ct_infraestructura_departamento',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_departamento" },
        ]
      },
      {
        name: "nombre",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nombre" },
        ]
      },
      {
        name: "id_direccion",
        using: "BTREE",
        fields: [
          { name: "id_direccion" },
        ]
      },
    ]
  });
  }
}
