<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261009005505 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Pokédex en français : numéro officiel comme identifiant, catégorie et description';
    }

    public function up(Schema $schema): void
    {
        // L'ancien Pokédex (noms anglais, Méga-évolutions) est remplacé entièrement :
        // relancer "app:import-pokemons" après la migration.
        // La capture n'existe pas encore, pokemon_user est donc vide.
        $this->addSql('DELETE FROM pokemon_user');
        $this->addSql('DROP TABLE pokemon');
        $this->addSql('CREATE TABLE pokemon (id INTEGER NOT NULL, name VARCHAR(50) NOT NULL, english_name VARCHAR(50) NOT NULL, category VARCHAR(50) NOT NULL, type1 VARCHAR(20) NOT NULL, type2 VARCHAR(20) DEFAULT NULL, hp INTEGER NOT NULL, attack INTEGER NOT NULL, defense INTEGER NOT NULL, special_attack INTEGER NOT NULL, special_defense INTEGER NOT NULL, speed INTEGER NOT NULL, generation INTEGER NOT NULL, legendary BOOLEAN NOT NULL, description VARCHAR(500) NOT NULL, PRIMARY KEY(id))');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DELETE FROM pokemon_user');
        $this->addSql('DROP TABLE pokemon');
        $this->addSql('CREATE TABLE pokemon (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, type1 VARCHAR(255) NOT NULL, type2 VARCHAR(255) DEFAULT NULL, total INTEGER NOT NULL, hp INTEGER NOT NULL, attack INTEGER NOT NULL, defense INTEGER NOT NULL, sp_atk INTEGER NOT NULL, sp_def INTEGER NOT NULL, speed INTEGER NOT NULL, generation INTEGER NOT NULL, legendary BOOLEAN NOT NULL)');
    }
}
