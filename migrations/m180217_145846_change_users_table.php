<?php

use yii\db\Migration;

/**
 * Class m180217_145846_change_users_table
 */
class m180217_145846_change_users_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->addColumn('users', 'golos_pub_key', $this->string(256));
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        echo "m180217_145846_change_users_table cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180217_145846_change_users_table cannot be reverted.\n";

        return false;
    }
    */
}
