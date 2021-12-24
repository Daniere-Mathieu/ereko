<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211214143700 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX IDX_A0BFA2DF6081BEF8 ON track_in_party');
        $this->addSql('DROP INDEX IDX_A0BFA2DFFB33CF0 ON track_in_party');
        $this->addSql('ALTER TABLE track_in_party ADD party_id INT NOT NULL, ADD track_id INT NOT NULL, DROP party_id_id, DROP track_id_id');
        $this->addSql('ALTER TABLE track_in_party ADD CONSTRAINT FK_A0BFA2DF213C1059 FOREIGN KEY (party_id) REFERENCES party (id)');
        $this->addSql('ALTER TABLE track_in_party ADD CONSTRAINT FK_A0BFA2DF5ED23C43 FOREIGN KEY (track_id) REFERENCES track (id)');
        $this->addSql('CREATE INDEX IDX_A0BFA2DF213C1059 ON track_in_party (party_id)');
        $this->addSql('CREATE INDEX IDX_A0BFA2DF5ED23C43 ON track_in_party (track_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE track_in_party DROP FOREIGN KEY FK_A0BFA2DF213C1059');
        $this->addSql('ALTER TABLE track_in_party DROP FOREIGN KEY FK_A0BFA2DF5ED23C43');
        $this->addSql('DROP INDEX IDX_A0BFA2DF213C1059 ON track_in_party');
        $this->addSql('DROP INDEX IDX_A0BFA2DF5ED23C43 ON track_in_party');
        $this->addSql('ALTER TABLE track_in_party ADD party_id_id INT NOT NULL, ADD track_id_id INT NOT NULL, DROP party_id, DROP track_id');
        $this->addSql('CREATE INDEX IDX_A0BFA2DF6081BEF8 ON track_in_party (party_id_id)');
        $this->addSql('CREATE INDEX IDX_A0BFA2DFFB33CF0 ON track_in_party (track_id_id)');
    }
}
