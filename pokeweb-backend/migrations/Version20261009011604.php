<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261009011604 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Combat : points de vie du Pokémon sauvage et Pokémon envoyé au combat';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TEMPORARY TABLE __temp__encounter AS SELECT id, user_id, pokemon_id, balls_left, status, started_at FROM encounter');
        $this->addSql('DROP TABLE encounter');
        $this->addSql('CREATE TABLE encounter (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, pokemon_id INTEGER NOT NULL, fighter_id INTEGER DEFAULT NULL, balls_left INTEGER NOT NULL, status VARCHAR(20) NOT NULL, started_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , wild_hp INTEGER NOT NULL, fighter_hp INTEGER DEFAULT NULL, CONSTRAINT FK_69D229CAA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_69D229CA2FE71C3E FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_69D229CA34934341 FOREIGN KEY (fighter_id) REFERENCES pokemon_user (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE)');
        // Les rencontres existantes commencent avec tous leurs PV (même formule que BattleService::maxHp)
        $this->addSql('INSERT INTO encounter (id, user_id, pokemon_id, balls_left, status, started_at, wild_hp) SELECT e.id, e.user_id, e.pokemon_id, e.balls_left, e.status, e.started_at, p.hp * 2 + 60 FROM __temp__encounter e JOIN pokemon p ON p.id = e.pokemon_id');
        $this->addSql('DROP TABLE __temp__encounter');
        $this->addSql('CREATE INDEX IDX_69D229CA2FE71C3E ON encounter (pokemon_id)');
        $this->addSql('CREATE INDEX IDX_69D229CAA76ED395 ON encounter (user_id)');
        $this->addSql('CREATE INDEX IDX_69D229CA34934341 ON encounter (fighter_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE TEMPORARY TABLE __temp__encounter AS SELECT id, user_id, pokemon_id, balls_left, status, started_at FROM encounter');
        $this->addSql('DROP TABLE encounter');
        $this->addSql('CREATE TABLE encounter (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, pokemon_id INTEGER NOT NULL, balls_left INTEGER NOT NULL, status VARCHAR(20) NOT NULL, started_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , CONSTRAINT FK_69D229CAA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_69D229CA2FE71C3E FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO encounter (id, user_id, pokemon_id, balls_left, status, started_at) SELECT id, user_id, pokemon_id, balls_left, status, started_at FROM __temp__encounter');
        $this->addSql('DROP TABLE __temp__encounter');
        $this->addSql('CREATE INDEX IDX_69D229CAA76ED395 ON encounter (user_id)');
        $this->addSql('CREATE INDEX IDX_69D229CA2FE71C3E ON encounter (pokemon_id)');
    }
}
