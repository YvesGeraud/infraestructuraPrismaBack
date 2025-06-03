import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ct_infraestructura_senalamientos_discapacidadAttributes {
  id_senalamientos: number;
  descripcion: string;
}

export type ct_infraestructura_senalamientos_discapacidadPk = "id_senalamientos";
export type ct_infraestructura_senalamientos_discapacidadId = ct_infraestructura_senalamientos_discapacidad[ct_infraestructura_senalamientos_discapacidadPk];
export type ct_infraestructura_senalamientos_discapacidadOptionalAttributes = "id_senalamientos";
export type ct_infraestructura_senalamientos_discapacidadCreationAttributes = Optional<ct_infraestructura_senalamientos_discapacidadAttributes, ct_infraestructura_senalamientos_discapacidadOptionalAttributes>;

export class ct_infraestructura_senalamientos_discapacidad extends Model<ct_infraestructura_senalamientos_discapacidadAttributes, ct_infraestructura_senalamientos_discapacidadCreationAttributes> implements ct_infraestructura_senalamientos_discapacidadAttributes {
  id_senalamientos!: number;
  descripcion!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof ct_infraestructura_senalamientos_discapacidad {
    return ct_infraestructura_senalamientos_discapacidad.init({
    id_senalamientos: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ct_infraestructura_senalamientos_discapacidad',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_senalamientos" },
        ]
      },
    ]
  });
  }
}
