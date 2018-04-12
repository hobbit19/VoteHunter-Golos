<?php
/**
 * Created by PhpStorm.
 * User: roma
 * Date: 10.04.18
 * Time: 13:19
 */

namespace app\commands;


use app\models\HashUrl;
use yii\console\Controller;

class ToolsController extends Controller
{
    public function actionRandHash()
    {
        $arr = [];
        $i = 0;
        $collision = 0;
        while ($i < 1000000) {
            while(true) {
                $k = generateRandomString(7);
                if(!isset($arr[$k])) {
                    $arr[$k] = 1;
                    $i++;
                    break;
                }
                $collision++;
            }
        }
        print "collision = $collision\n";
        print "total = ".count($arr) . PHP_EOL;
        foreach ($arr as $strKey => $intVal) {
            $objUrl = new HashUrl();
            $objUrl->hash = 'us-'.$strKey;
            $objUrl->used = 0;
            $objUrl->save();

        }

    }

}

function generateRandomString($length = 32)
{
    $bytes = \Yii::$app->security->generateRandomKey($length);
    // '=' character(s) returned by base64_encode() are always discarded because
    // they are guaranteed to be after position $length in the base64_encode() output.
    return strtolower(strtr(substr(base64_encode($bytes), 0, $length), '+/', 'AB'));
}
