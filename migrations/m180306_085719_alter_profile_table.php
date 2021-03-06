<?php

use yii\db\Migration;

/**
 * Class m180306_085719_alter_profile_table
 */
class m180306_085719_alter_profile_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        /*
         * ALTER TABLE `votehunter`.`profile`
  DROP COLUMN `avatar`,
  ADD COLUMN `profile_image` VARCHAR(256) NULL AFTER `user_id`,
  CHANGE `big_logo` `cover_image` VARCHAR(256) CHARSET utf8 COLLATE utf8_general_ci NULL,
  CHANGE `fio` `name` VARCHAR(100) CHARSET utf8 COLLATE utf8_general_ci NULL,
  ADD COLUMN `promo_video` VARCHAR(256) NULL AFTER `facebook`,
  ADD COLUMN `cat_id` INT(10) UNSIGNED NOT NULL AFTER `promo_video`,
  ADD COLUMN `url` VARCHAR(256) NOT NULL AFTER `cat_id`;
  
         */
        $this->dropColumn('profile', 'avatar');
        $this->addColumn('profile', 'profile_image', $this->string(256)->after('user_id'));
        $this->renameColumn('profile','big_logo', 'cover_image');
        $this->renameColumn('profile', 'fio', 'name');
        $this->addColumn('profile', 'promo_video', $this->string(256));
        $this->addColumn('profile', 'cat_id', $this->integer(10)->notNull()->unsigned());
        $this->addColumn('profile', 'url', $this->string(256));

    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180306_085719_alter_profile_table cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180306_085719_alter_profile_table cannot be reverted.\n";

        return false;
    }
    */
}
