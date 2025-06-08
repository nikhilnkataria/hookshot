import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable('webhook_attempts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

    table
      .uuid('webhook_id')
      .notNullable()
      .references('id')
      .inTable('webhooks')
      .onDelete('CASCADE');

    table.integer('attempt_number').notNullable();
    table
      .enu('status', ['success', 'failed'], {
        useNative: true,
        enumName: 'webhook_attempt_status_enum',
      })
      .notNullable();

    table.integer('response_code').nullable();
    table.jsonb('response_body').nullable();
    table.integer('duration_ms').nullable();

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('webhook_attempts');
  await knex.raw('DROP TYPE IF EXISTS webhook_attempt_status_enum');
}
