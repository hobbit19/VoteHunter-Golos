<?php

use yii\db\Migration;

/**
 * Class m180217_095108_create_paid_posts_tables
 */
class m180217_095108_create_paid_posts_tables extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->createTable('paid_posts', [
            'id' => $this->primaryKey(),
            'user_id' => $this->integer(10)->unsigned(),
            'post_id' => $this->integer(10)->unsigned(),
            'sum' => $this->decimal(12,8)->unsigned(),
            'pay_date' => $this->timestamp()->notNull(),
            'tx_id' => $this->string(256)
        ]);
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        echo "m180217_095108_create_paid_posts_tables cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180217_095108_create_paid_posts_tables cannot be reverted.\n";

        return false;
    }
    */
}
