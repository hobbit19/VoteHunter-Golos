<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\commands;

use app\api\golos\GolosApi;
use yii\console\Controller;

/**
 * This command echoes the first argument that you have entered.
 *
 * This command is provided as an example for you to learn how to create console commands.
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class HelloController extends Controller
{
    /**
     * This command echoes what you have entered as the message.
     * @param string $message the message to be echoed.
     */
    public function actionIndex($message = 'hello world')
    {
        echo $message . "\n";
    }

    public function actionTestApi()
    {
        $objGolos = new GolosApi();
        print_r($objGolos->getAccount('igor', GolosApi::ACCOUNT_GOLOS_ALL));
    }

    public function actionTestComment()
    {
        $objGolos = new GolosApi();
        $objGolos->comment();

    }

    public function actionPosts()
    {
        $objGolos = new GolosApi();
        $objGolos->getDiscussionsByBlog('gaidar', 'yousource');
    }

    public function actionTransfer()
    {
        $objGolos = new GolosApi();
        $objGolos->transfer('5JohDVuYaxNpXsPrMW9FWhVBfT17oet1KXPZw99QwDVW8AkqzhT', 'gaidar', 'vasya', 1, 'Patron');
    }



}
