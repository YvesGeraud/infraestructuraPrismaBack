import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ct_infraestructura_adecuacion_discapacidadAttributes {
  id_adecuacion: number;
  descripcion: string;
}

export type ct_infraestructura_adecuacion_discapacidadPk = "id_adecuacion";
export type ct_infraestructura_adecuacion_discapacidadId = ct_infraestructura_adecuacion_discapacidad[ct_infraestructura_adecuacion_discapacidadPk];
export type ct_infraestructura_adecuacion_discapacidadOptionalAttributes = "id_adecuacion";
export type ct_infraestructura_adecuacion_discapacidadCreationAttributes = Optional<ct_infraestructura_adecuacion_discapacidadAttributes, ct_infraestructura_adecuacion_discapacidadOptionalAttributes>;

export class ct_infraestructura_adecuacion_discapacidad extends Model<ct_infraestructura_adecuacion_discapacidadAttributes, ct_infraestructura_adecuacion_discapacidadCreationAttributes> implements ct_infraestructura_adecuacion_discapacidadAttributes {
  id_adecuacion!: number;
  descripcion!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof ct_infraestructura_adecuacion_discapacidad {
    return ct_infraestructura_adecuacion_discapacidad.init({
    id_adecuacion: {
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
    tableName: 'ct_infraestructura_adecuacion_discapacidad',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_adecuacion" },
        ]
      },
    ]
  });
  }
}
