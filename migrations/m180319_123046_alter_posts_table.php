<?php

use yii\db\Migration;

/**
 * Class m180319_123046_alter_posts_table
 */
class m180319_123046_alter_posts_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->renameColumn('posts', 'description', 'body');
        $this->addColumn('posts', 'cat_id', $this->integer(10)->unsigned()->notNull()->defaultValue(0));
        $this->addColumn('posts', 'patron_only', $this->boolean()->notNull()->defaultValue(0));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180319_123046_alter_posts_table cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180319_123046_alter_posts_table cannot be reverted.\n";

        return false;
    }
    */
}
