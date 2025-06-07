import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ct_codigo_postalAttributes {
  id_codigo_postal: number;
  codigo_postal?: string;
  asentamiento?: string;
  id_localidad?: number;
}

export type ct_codigo_postalPk = "id_codigo_postal";
export type ct_codigo_postalId = ct_codigo_postal[ct_codigo_postalPk];
export type ct_codigo_postalOptionalAttributes = "id_codigo_postal" | "codigo_postal" | "asentamiento" | "id_localidad";
export type ct_codigo_postalCreationAttributes = Optional<ct_codigo_postalAttributes, ct_codigo_postalOptionalAttributes>;

export class ct_codigo_postal extends Model<ct_codigo_postalAttributes, ct_codigo_postalCreationAttributes> implements ct_codigo_postalAttributes {
  id_codigo_postal!: number;
  codigo_postal?: string;
  asentamiento?: string;
  id_localidad?: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof ct_codigo_postal {
    return ct_codigo_postal.init({
    id_codigo_postal: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    codigo_postal: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    asentamiento: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    id_localidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ct_codigo_postal',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_codigo_postal" },
        ]
      },
      {
        name: "id_localidad",
        using: "BTREE",
        fields: [
          { name: "id_localidad" },
        ]
      },
    ]
  });
  }
}
