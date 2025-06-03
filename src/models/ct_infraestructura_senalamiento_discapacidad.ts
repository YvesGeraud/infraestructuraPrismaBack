import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ct_infraestructura_senalamiento_discapacidadAttributes {
  id_senalamiento: number;
  descripcion: string;
}

export type ct_infraestructura_senalamiento_discapacidadPk = "id_senalamiento";
export type ct_infraestructura_senalamiento_discapacidadId = ct_infraestructura_senalamiento_discapacidad[ct_infraestructura_senalamiento_discapacidadPk];
export type ct_infraestructura_senalamiento_discapacidadOptionalAttributes = "id_senalamiento";
export type ct_infraestructura_senalamiento_discapacidadCreationAttributes = Optional<ct_infraestructura_senalamiento_discapacidadAttributes, ct_infraestructura_senalamiento_discapacidadOptionalAttributes>;

export class ct_infraestructura_senalamiento_discapacidad extends Model<ct_infraestructura_senalamiento_discapacidadAttributes, ct_infraestructura_senalamiento_discapacidadCreationAttributes> implements ct_infraestructura_senalamiento_discapacidadAttributes {
  id_senalamiento!: number;
  descripcion!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof ct_infraestructura_senalamiento_discapacidad {
    return ct_infraestructura_senalamiento_discapacidad.init({
    id_senalamiento: {
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
    tableName: 'ct_infraestructura_senalamiento_discapacidad',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_senalamiento" },
        ]
      },
    ]
  });
  }
}
