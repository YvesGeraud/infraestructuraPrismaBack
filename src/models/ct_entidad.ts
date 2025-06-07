import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ct_municipio, ct_municipioId } from './ct_municipio';

export interface ct_entidadAttributes {
  id_entidad: number;
  nombre?: string;
  abreviatura?: string;
}

export type ct_entidadPk = "id_entidad";
export type ct_entidadId = ct_entidad[ct_entidadPk];
export type ct_entidadOptionalAttributes = "id_entidad" | "nombre" | "abreviatura";
export type ct_entidadCreationAttributes = Optional<ct_entidadAttributes, ct_entidadOptionalAttributes>;

export class ct_entidad extends Model<ct_entidadAttributes, ct_entidadCreationAttributes> implements ct_entidadAttributes {
  id_entidad!: number;
  nombre?: string;
  abreviatura?: string;

  // ct_entidad hasMany ct_municipio via id_entidad
  ct_municipios!: ct_municipio[];
  getCt_municipios!: Sequelize.HasManyGetAssociationsMixin<ct_municipio>;
  setCt_municipios!: Sequelize.HasManySetAssociationsMixin<ct_municipio, ct_municipioId>;
  addCt_municipio!: Sequelize.HasManyAddAssociationMixin<ct_municipio, ct_municipioId>;
  addCt_municipios!: Sequelize.HasManyAddAssociationsMixin<ct_municipio, ct_municipioId>;
  createCt_municipio!: Sequelize.HasManyCreateAssociationMixin<ct_municipio>;
  removeCt_municipio!: Sequelize.HasManyRemoveAssociationMixin<ct_municipio, ct_municipioId>;
  removeCt_municipios!: Sequelize.HasManyRemoveAssociationsMixin<ct_municipio, ct_municipioId>;
  hasCt_municipio!: Sequelize.HasManyHasAssociationMixin<ct_municipio, ct_municipioId>;
  hasCt_municipios!: Sequelize.HasManyHasAssociationsMixin<ct_municipio, ct_municipioId>;
  countCt_municipios!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof ct_entidad {
    return ct_entidad.init({
    id_entidad: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: "nombre"
    },
    abreviatura: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ct_entidad',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_entidad" },
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
    ]
  });
  }
}
