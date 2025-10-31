<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251031011224 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__pokemon AS SELECT id, name, type1, type2, total, hp, attack, defense, sp_atk, sp_def, speed, generation, legendary FROM pokemon');
        $this->addSql('DROP TABLE pokemon');
        $this->addSql('CREATE TABLE pokemon (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, type1 VARCHAR(255) NOT NULL, type2 VARCHAR(255) DEFAULT NULL, total INTEGER NOT NULL, hp INTEGER NOT NULL, attack INTEGER NOT NULL, defense INTEGER NOT NULL, sp_atk INTEGER NOT NULL, sp_def INTEGER NOT NULL, speed INTEGER NOT NULL, generation INTEGER NOT NULL, legendary BOOLEAN NOT NULL)');
        $this->addSql('INSERT INTO pokemon (id, name, type1, type2, total, hp, attack, defense, sp_atk, sp_def, speed, generation, legendary) SELECT id, name, type1, type2, total, hp, attack, defense, sp_atk, sp_def, speed, generation, legendary FROM __temp__pokemon');
        $this->addSql('DROP TABLE __temp__pokemon');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__pokemon AS SELECT id, name, type1, type2, total, hp, attack, defense, sp_atk, sp_def, speed, generation, legendary FROM pokemon');
        $this->addSql('DROP TABLE pokemon');
        $this->addSql('CREATE TABLE pokemon (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, type1 VARCHAR(255) NOT NULL, type2 VARCHAR(255) NOT NULL, total INTEGER NOT NULL, hp INTEGER NOT NULL, attack INTEGER NOT NULL, defense INTEGER NOT NULL, sp_atk INTEGER NOT NULL, sp_def INTEGER NOT NULL, speed INTEGER NOT NULL, generation INTEGER NOT NULL, legendary BOOLEAN NOT NULL)');
        $this->addSql('INSERT INTO pokemon (id, name, type1, type2, total, hp, attack, defense, sp_atk, sp_def, speed, generation, legendary) SELECT id, name, type1, type2, total, hp, attack, defense, sp_atk, sp_def, speed, generation, legendary FROM __temp__pokemon');
        $this->addSql('DROP TABLE __temp__pokemon');
    }
}
