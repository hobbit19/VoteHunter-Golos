<?php

use yii\db\Migration;

/**
 * Class m180218_090247_update_posts_table
 */
class m180218_090247_update_posts_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->addColumn('posts', 'golos_parentPermlink', $this->string(256));
        $this->addColumn('posts', 'user_id', $this->integer(10)->unsigned());
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        echo "m180218_090247_update_posts_table cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180218_090247_update_posts_table cannot be reverted.\n";

        return false;
    }
    */
}
