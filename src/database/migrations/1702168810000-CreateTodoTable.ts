import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateTodoTable1702168810000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "todos",
        columns: [
          {
            name: "uuid",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "gen_random_uuid()",
          },
          {
            name: "title",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "desc",
            type: "text",
            isNullable: true,
          },
          {
            name: "status",
            type: "enum",
            enum: ["pending", "doing", "completed"],
            default: "'pending'",
            isNullable: false,
          },
          {
            name: "userId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Add foreign key constraint
    await queryRunner.createForeignKey(
      "todos",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["uuid"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    // Create index for faster queries
    await queryRunner.query(`CREATE INDEX idx_todos_userId ON todos("userId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("todos");
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("userId") !== -1
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey("todos", foreignKey);
    }

    await queryRunner.query(`DROP INDEX IF EXISTS idx_todos_userId`);
    await queryRunner.dropTable("todos");
  }
}
