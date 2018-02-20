<?php

use yii\db\Migration;

/**
 * Handles the creation of table `users`.
 */
class m180217_080256_create_users_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('users', [
            'id' => $this->primaryKey(),
            'golos_nick' => $this->string(256),
        ]);
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropTable('users');
    }
}
