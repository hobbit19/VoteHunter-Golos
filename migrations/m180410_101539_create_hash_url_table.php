<?php

use yii\db\Migration;

/**
 * Handles the creation of table `hash_url`.
 */
class m180410_101539_create_hash_url_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('hash_url', [
            'hash' => $this->string('10')->notNull()->defaultValue(''),
            'used' => $this->boolean()->defaultValue(false)
        ]);
        $this->addPrimaryKey('hash', 'hash_url', 'hash');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('hash_url');
    }
}
