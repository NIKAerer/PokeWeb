<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251031013432 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__pokemon_user AS SELECT id, nickname, level, xp, captured_at FROM pokemon_user');
        $this->addSql('DROP TABLE pokemon_user');
        $this->addSql('CREATE TABLE pokemon_user (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, pokemon_id INTEGER NOT NULL, nickname VARCHAR(255) DEFAULT NULL, level INTEGER NOT NULL, xp INTEGER NOT NULL, captured_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , CONSTRAINT FK_B13AA80AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_B13AA80A2FE71C3E FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO pokemon_user (id, nickname, level, xp, captured_at) SELECT id, nickname, level, xp, captured_at FROM __temp__pokemon_user');
        $this->addSql('DROP TABLE __temp__pokemon_user');
        $this->addSql('CREATE INDEX IDX_B13AA80AA76ED395 ON pokemon_user (user_id)');
        $this->addSql('CREATE INDEX IDX_B13AA80A2FE71C3E ON pokemon_user (pokemon_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__pokemon_user AS SELECT id, nickname, level, xp, captured_at FROM pokemon_user');
        $this->addSql('DROP TABLE pokemon_user');
        $this->addSql('CREATE TABLE pokemon_user (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, nickname VARCHAR(255) DEFAULT NULL, level INTEGER NOT NULL, xp INTEGER NOT NULL, captured_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        )');
        $this->addSql('INSERT INTO pokemon_user (id, nickname, level, xp, captured_at) SELECT id, nickname, level, xp, captured_at FROM __temp__pokemon_user');
        $this->addSql('DROP TABLE __temp__pokemon_user');
    }
}
