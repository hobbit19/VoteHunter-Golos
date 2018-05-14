<?php

use yii\db\Migration;

/**
 * Class m180507_124841_alter_users_table
 */
class m180507_124841_alter_users_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('users', 'community_permlink', $this->string(256)->null());

    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180507_124841_alter_users_table cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180507_124841_alter_users_table cannot be reverted.\n";

        return false;
    }
    */
}
