import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
    taskId!: string;

  @Column()
    title!: string;

  @Column()
    description!: string;

  @Column({ type: "timestamp" })
    dueDate!: Date;

  @Column()
    status!: string;

  @Column()
    userEmail!: string;
}
