<?php

use yii\db\Migration;

/**
 * Class m180322_155448_create_auth
 */
class m180322_155448_create_auth extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        return true;
        //$this->addColumn('users', 'username', $this->string()->notNull());
        $this->addColumn('users', 'auth_key', $this->string()->notNull());
        $this->addColumn('users', 'password_hash', $this->string()->notNull());
        $this->addColumn('users', 'password_reset_token', $this->string()->notNull());
        $this->addColumn('users', 'email', $this->string()->notNull());
        $this->addColumn('users', 'status', $$this->smallInteger()->notNull()->defaultValue(10));
        $this->addColumn('users', 'created_at', $this->integer()->notNull());
        $this->addColumn('users', 'updated_at', $this->integer()->notNull());

        $this->createTable('auth', [
            'id' => $this->primaryKey(),
            'user_id' => $this->integer()->notNull(),
            'source' => $this->string()->notNull(),
            'source_id' => $this->string()->notNull(),
        ]);

    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        return true;
        $this->dropTable('auth');
        $this->dropColumn('users', 'auth_key');
        $this->dropColumn('users', 'password_hash');
        $this->dropColumn('users', 'password_reset_token');
        $this->dropColumn('users', 'email');
        $this->dropColumn('users', 'status');
        $this->dropColumn('users', 'created_at');
        $this->dropColumn('users', 'updated_at');

    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180322_155448_create_auth cannot be reverted.\n";

        return false;
    }
    */
}
