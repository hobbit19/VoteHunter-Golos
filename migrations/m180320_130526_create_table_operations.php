<?php

use yii\db\Migration;

/**
 * Class m180320_130526_create_table_operations
 */
class m180320_130526_create_table_operations extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('operations', [
            'id' => $this->primaryKey(10)->unsigned(),
            'user_from' => $this->string(50)->notNull(),
            'user_to' => $this->string(50)->notNull(),
            'symbol' => $this->string(20)->notNull(),
            'sum_usd' => $this->integer(10)->unsigned()->notNull(),
            'sum_coin' => $this->decimal(8,3)->notNull(),
            'added' => $this->timestamp()->notNull()->defaultExpression('CURRENT_TIMESTAMP'),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180320_130526_create_table_operations cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180320_130526_create_table_operations cannot be reverted.\n";

        return false;
    }
    */
}
