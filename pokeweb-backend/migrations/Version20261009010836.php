<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261009010836 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Rencontres avec les Pokémon sauvages, collection simplifiée (surnom et date de capture)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE encounter (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, pokemon_id INTEGER NOT NULL, balls_left INTEGER NOT NULL, status VARCHAR(20) NOT NULL, started_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , CONSTRAINT FK_69D229CAA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_69D229CA2FE71C3E FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_69D229CAA76ED395 ON encounter (user_id)');
        $this->addSql('CREATE INDEX IDX_69D229CA2FE71C3E ON encounter (pokemon_id)');
        $this->addSql('CREATE TEMPORARY TABLE __temp__pokemon_user AS SELECT id, user_id, pokemon_id, nickname, captured_at FROM pokemon_user');
        $this->addSql('DROP TABLE pokemon_user');
        $this->addSql('CREATE TABLE pokemon_user (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, pokemon_id INTEGER NOT NULL, nickname VARCHAR(30) DEFAULT NULL, captured_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , CONSTRAINT FK_B13AA80AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_B13AA80A2FE71C3E FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO pokemon_user (id, user_id, pokemon_id, nickname, captured_at) SELECT id, user_id, pokemon_id, nickname, captured_at FROM __temp__pokemon_user');
        $this->addSql('DROP TABLE __temp__pokemon_user');
        $this->addSql('CREATE INDEX IDX_B13AA80A2FE71C3E ON pokemon_user (pokemon_id)');
        $this->addSql('CREATE INDEX IDX_B13AA80AA76ED395 ON pokemon_user (user_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE encounter');
        $this->addSql('CREATE TEMPORARY TABLE __temp__pokemon_user AS SELECT id, user_id, pokemon_id, nickname, captured_at FROM pokemon_user');
        $this->addSql('DROP TABLE pokemon_user');
        $this->addSql('CREATE TABLE pokemon_user (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, pokemon_id INTEGER NOT NULL, nickname VARCHAR(255) DEFAULT NULL, captured_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , level INTEGER NOT NULL, xp INTEGER NOT NULL, CONSTRAINT FK_B13AA80AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_B13AA80A2FE71C3E FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO pokemon_user (id, user_id, pokemon_id, nickname, captured_at) SELECT id, user_id, pokemon_id, nickname, captured_at FROM __temp__pokemon_user');
        $this->addSql('DROP TABLE __temp__pokemon_user');
        $this->addSql('CREATE INDEX IDX_B13AA80AA76ED395 ON pokemon_user (user_id)');
        $this->addSql('CREATE INDEX IDX_B13AA80A2FE71C3E ON pokemon_user (pokemon_id)');
    }
}
