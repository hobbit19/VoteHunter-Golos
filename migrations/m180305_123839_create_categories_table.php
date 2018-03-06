<?php

use yii\db\Migration;

/**
 * Handles the creation of table `categories`.
 */
class m180305_123839_create_categories_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('categories', [
            'id' => $this->primaryKey(),
            'name' => $this->string(100)->notNull(),
        ]);
        $this->insert('categories',
            [
                'name' => 'Блокчейн'
            ]);
        $this->insert('categories',
            [
                'name' => 'Инвестиции'
            ]);
        $this->insert('categories',
            [
                'name' => 'Путешествия'
            ]);
        $this->insert('categories',
            [
                'name' => 'Образование'
            ]);
        $this->insert('categories',
            [
                'name' => 'Фотография'
            ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('categories');
    }
}
