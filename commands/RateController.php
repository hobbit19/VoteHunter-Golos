<?php
/**
 * Created by PhpStorm.
 * User: roma
 * Date: 20.03.18
 * Time: 11:55
 */

namespace app\commands;


use app\models\Rates;
use yii\base\ErrorException;
use yii\console\Controller;

class RateController extends Controller
{
    public function actionCoinMarketCap()
    {
        $arrCoins = ['golos', 'steem'];
        foreach ($arrCoins as $strCoin) {
            try {
                $strData = file_get_contents('https://api.coinmarketcap.com/v1/ticker/' . $strCoin . '/?convert=usd');
                if ($strData !== false) {
                    $arrData = json_decode($strData, true);
                    $objRate = Rates::findOne(['symbol' => strtoupper($strCoin)]);
                    if(empty($objRate)) {
                        $objRate = new Rates();
                        $objRate->symbol = strtoupper($strCoin);
                    }
                    $objRate->price_usd = $arrData[0]['price_usd'];
                    $objRate->price_btc = $arrData[0]['price_btc'];
                    $objRate->save();
                }
            } catch (ErrorException $e) {
                //log something
            }
        }
    }
}