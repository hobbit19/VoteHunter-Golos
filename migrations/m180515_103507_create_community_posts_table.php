<?php

use yii\db\Migration;

/**
 * Handles the creation of table `community_posts`.
 */
class m180515_103507_create_community_posts_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('community_posts', [
            'id' => $this->primaryKey(),
            'author' => $this->string(256)->notNull(),
            'permlink' => $this->string(256)->notNull(),
            'user_id' => $this->integer(10)->unsigned()->notNull(),
            'secret' => $this->string(256)->notNull(),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('community_posts');
    }
}
