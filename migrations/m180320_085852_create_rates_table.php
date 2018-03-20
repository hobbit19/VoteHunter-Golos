<?php

use yii\db\Migration;

/**
 * Handles the creation of table `rates`.
 */
class m180320_085852_create_rates_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('rates', [
            'id' => $this->primaryKey(),
            'symbol' => $this->string(20),
            'price_usd' => $this->decimal(12,8),
            'price_btc' => $this->decimal(12, 8)
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('rates');
    }
}
