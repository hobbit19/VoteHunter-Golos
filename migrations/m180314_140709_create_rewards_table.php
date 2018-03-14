<?php

use yii\db\Migration;

/**
 * Handles the creation of table `rewards`.
 */
class m180314_140709_create_rewards_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('rewards', [
            'id' => $this->primaryKey(),
            'user_id' => $this->integer(10)->unsigned()->notNull(),
            'amount' => $this->decimal(8,3),
            'reward' => $this->text()
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('rewards');
    }
}
