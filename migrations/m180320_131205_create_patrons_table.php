<?php

use yii\db\Migration;

/**
 * Handles the creation of table `patrons`.
 */
class m180320_131205_create_patrons_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('patrons', [
            'id' => $this->primaryKey(),
            'user_id' => $this->integer(10)->notNull()->unsigned(),
            'patron_id' => $this->integer(10)->notNull()->unsigned(),
            'patron_sum' => $this->integer(10)->notNull()->unsigned(),
            'status' => $this->integer(10)->notNull()->unsigned(),
            'changed' => $this->timestamp()->notNull()->defaultExpression('CURRENT_TIMESTAMP'),
        ]);
        $this->createIndex('user_id', 'patrons', 'user_id');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('patrons');
    }
}
