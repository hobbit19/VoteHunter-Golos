<?php
/**
 * Created by PhpStorm.
 * User: roma
 * Date: 05.03.18
 * Time: 15:42
 */

namespace app\controllers;


use app\models\Categories;
use yii\web\Controller;

class CatController extends Controller
{
    public function beforeAction($action)
    {
        \Yii::$app->request->enableCsrfValidation = false;
        $this->enableCsrfValidation = false;
        \Yii::$app->response->format = 'json';
        return parent::beforeAction($action);
    }

    public function actionList()
    {
        $arrCats = Categories::find()->orderBy('name')->all();
        return [
            'status' => 'ok',
            'cats' => $arrCats
        ];
    }
}