<?php

use yii\db\Migration;

/**
 * Class m180319_145932_alter_posts_table
 */
class m180319_145932_alter_posts_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->renameColumn('posts', 'golos_permlink', 'permlink');
        $this->renameColumn('posts', 'golos_parentPermlink', 'parentPermlink');

    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180319_145932_alter_posts_table cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180319_145932_alter_posts_table cannot be reverted.\n";

        return false;
    }
    */
}
