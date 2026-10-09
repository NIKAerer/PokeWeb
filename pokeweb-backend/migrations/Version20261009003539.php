<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261009003539 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Schéma initial : Pokédex, utilisateurs et Pokémon capturés';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE pokemon (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, type1 VARCHAR(255) NOT NULL, type2 VARCHAR(255) DEFAULT NULL, total INTEGER NOT NULL, hp INTEGER NOT NULL, attack INTEGER NOT NULL, defense INTEGER NOT NULL, sp_atk INTEGER NOT NULL, sp_def INTEGER NOT NULL, speed INTEGER NOT NULL, generation INTEGER NOT NULL, legendary BOOLEAN NOT NULL)');
        $this->addSql('CREATE TABLE pokemon_user (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, pokemon_id INTEGER NOT NULL, nickname VARCHAR(255) DEFAULT NULL, level INTEGER NOT NULL, xp INTEGER NOT NULL, captured_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , CONSTRAINT FK_B13AA80AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_B13AA80A2FE71C3E FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_B13AA80AA76ED395 ON pokemon_user (user_id)');
        $this->addSql('CREATE INDEX IDX_B13AA80A2FE71C3E ON pokemon_user (pokemon_id)');
        $this->addSql('CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles CLOB NOT NULL --(DC2Type:json)
        , password VARCHAR(255) NOT NULL)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON user (email)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE pokemon');
        $this->addSql('DROP TABLE pokemon_user');
        $this->addSql('DROP TABLE user');
    }
}
