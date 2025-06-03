import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ct_infraestructura_area_de_servicioAttributes {
  id_servicio: number;
  descripcion?: string;
}

export type ct_infraestructura_area_de_servicioPk = "id_servicio";
export type ct_infraestructura_area_de_servicioId = ct_infraestructura_area_de_servicio[ct_infraestructura_area_de_servicioPk];
export type ct_infraestructura_area_de_servicioOptionalAttributes = "id_servicio" | "descripcion";
export type ct_infraestructura_area_de_servicioCreationAttributes = Optional<ct_infraestructura_area_de_servicioAttributes, ct_infraestructura_area_de_servicioOptionalAttributes>;

export class ct_infraestructura_area_de_servicio extends Model<ct_infraestructura_area_de_servicioAttributes, ct_infraestructura_area_de_servicioCreationAttributes> implements ct_infraestructura_area_de_servicioAttributes {
  id_servicio!: number;
  descripcion?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof ct_infraestructura_area_de_servicio {
    return ct_infraestructura_area_de_servicio.init({
    id_servicio: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ct_infraestructura_area_de_servicio',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_servicio" },
        ]
      },
    ]
  });
  }
}
