<?php

use yii\db\Migration;

/**
 * Handles the creation of table `transactions`.
 */
class m180312_095920_create_transactions_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('transactions', [
            'id' => $this->primaryKey(),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('transactions');
    }
}
