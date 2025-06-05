import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ct_localidad, ct_localidadId } from './ct_localidad';
import type { rl_infraestructura_edificios, rl_infraestructura_edificiosId } from './rl_infraestructura_edificios';

export interface ct_infraestructura_supervisorAttributes {
  id_supervisor: number;
  nombre_unidad?: string;
  cct?: string;
  calle?: string;
  numero_exterior?: string;
  id_localidad?: number;
  colonia?: string;
  codigo_postal?: number;
  ubicacion?: any;
  vigente?: number;
  id_rupet_info?: number;
}

export type ct_infraestructura_supervisorPk = "id_supervisor";
export type ct_infraestructura_supervisorId = ct_infraestructura_supervisor[ct_infraestructura_supervisorPk];
export type ct_infraestructura_supervisorOptionalAttributes = "id_supervisor" | "nombre_unidad" | "cct" | "calle" | "numero_exterior" | "id_localidad" | "colonia" | "codigo_postal" | "ubicacion" | "vigente" | "id_rupet_info";
export type ct_infraestructura_supervisorCreationAttributes = Optional<ct_infraestructura_supervisorAttributes, ct_infraestructura_supervisorOptionalAttributes>;

export class ct_infraestructura_supervisor extends Model<ct_infraestructura_supervisorAttributes, ct_infraestructura_supervisorCreationAttributes> implements ct_infraestructura_supervisorAttributes {
  id_supervisor!: number;
  nombre_unidad?: string;
  cct?: string;
  calle?: string;
  numero_exterior?: string;
  id_localidad?: number;
  colonia?: string;
  codigo_postal?: number;
  ubicacion?: any;
  vigente?: number;
  id_rupet_info?: number;

  // ct_infraestructura_supervisor hasMany rl_infraestructura_edificios via id_supervisor
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
  // ct_infraestructura_supervisor belongsTo ct_localidad via id_localidad
  id_localidad_ct_localidad!: ct_localidad;
  getId_localidad_ct_localidad!: Sequelize.BelongsToGetAssociationMixin<ct_localidad>;
  setId_localidad_ct_localidad!: Sequelize.BelongsToSetAssociationMixin<ct_localidad, ct_localidadId>;
  createId_localidad_ct_localidad!: Sequelize.BelongsToCreateAssociationMixin<ct_localidad>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ct_infraestructura_supervisor {
    return ct_infraestructura_supervisor.init({
    id_supervisor: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_unidad: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cct: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    calle: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    numero_exterior: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_localidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ct_localidad',
        key: 'id_localidad'
      }
    },
    colonia: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    codigo_postal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ubicacion: {
      type: "POINT",
      allowNull: true
    },
    vigente: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    id_rupet_info: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ct_infraestructura_supervisor',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_supervisor" },
        ]
      },
      {
        name: "id_localidad",
        using: "BTREE",
        fields: [
          { name: "id_localidad" },
        ]
      },
      {
        name: "id_rupet_info",
        using: "BTREE",
        fields: [
          { name: "id_rupet_info" },
        ]
      },
    ]
  });
  }
}
