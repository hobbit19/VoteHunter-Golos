<?php

use yii\db\Migration;

/**
 * Handles the creation of table `goals`.
 */
class m180306_152604_create_goals_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('goals', [
            'id' => $this->primaryKey(10)->unsigned(),
            'user_id' => $this->integer(10)->unsigned()->notNull(),
            'added' => $this->timestamp()->notNull()->defaultExpression('CURRENT_TIMESTAMP'),
            'goal' => $this->text(),
            'collected' => $this->decimal(8,3),
            'reached' => $this->boolean()->defaultValue(false),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('goals');
    }
}
