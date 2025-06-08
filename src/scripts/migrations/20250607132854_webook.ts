import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await knex.schema.createTable('webhooks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('target_url').notNullable();
    table.jsonb('payload').notNullable();
    table.jsonb('retry_config').notNullable();
    table.jsonb('headers');
    table.jsonb('meta');

    table
      .enu('status', ['pending', 'delivered', 'failed', 'dead'], {
        useNative: true,
        enumName: 'webhook_status_enum',
      })
      .notNullable()
      .defaultTo('pending');

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('webhooks');
  await knex.raw('DROP TYPE IF EXISTS webhook_status_enum');
}
