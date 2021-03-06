<?php
namespace app\helpers;

use app\models\Profile;
use yii\web\UploadedFile;

/**
 * Created by PhpStorm.
 * User: roma
 * Date: 14.03.18
 * Time: 15:48
 */
class ImageHelper {

    const COVER_IMAGES = '/users_content/cover/';
    const PROFILE_IMAGES = '/users_content/profile/';
    const LIST_IMAGES = '/users_content/list/';

    public static function processCoverImage($objImage)
    {
        /* @var $objImage UploadedFile*/
        $strFileName = \Yii::$app->user->getId().'/'.time().'.' . $objImage->extension;
        if(!is_dir(\Yii::getAlias('@webroot'). self::COVER_IMAGES. \Yii::$app->user->getId())) {
            mkdir(\Yii::getAlias('@webroot'). self::COVER_IMAGES. \Yii::$app->user->getId(),0777, true);
        }
        copy($objImage->tempName, \Yii::getAlias('@webroot'). self::COVER_IMAGES . $strFileName);
        $objProfile = Profile::findOne(['user_id' => \Yii::$app->user->getId()]);
        $objProfile->cover_image = self::COVER_IMAGES . $strFileName;
        return $objProfile->save();
    }

    public static function processListImage($objImage)
    {
        /* @var $objImage UploadedFile*/
        $strFileName = \Yii::$app->user->getId().'/'.time().'.' . $objImage->extension;
        if(!is_dir(\Yii::getAlias('@webroot'). self::LIST_IMAGES. \Yii::$app->user->getId())) {
            mkdir(\Yii::getAlias('@webroot'). self::LIST_IMAGES. \Yii::$app->user->getId(),0777, true);
        }
        copy($objImage->tempName, \Yii::getAlias('@webroot'). self::LIST_IMAGES . $strFileName);
        $objProfile = Profile::findOne(['user_id' => \Yii::$app->user->getId()]);
        $objProfile->list_image = self::LIST_IMAGES . $strFileName;
        return $objProfile->save();
    }

    public static function processProfileImage($objImage)
    {
        /* @var $objImage UploadedFile*/
        $strFileName = \Yii::$app->user->getId().'/'.time().'.' . $objImage->extension;
        if(!is_dir(\Yii::getAlias('@webroot'). self::PROFILE_IMAGES. \Yii::$app->user->getId())) {
            mkdir(\Yii::getAlias('@webroot'). self::PROFILE_IMAGES. \Yii::$app->user->getId(),0777, true);
        }
        copy($objImage->tempName, \Yii::getAlias('@webroot'). self::PROFILE_IMAGES . $strFileName);
        $objProfile = Profile::findOne(['user_id' => \Yii::$app->user->getId()]);
        $objProfile->profile_image = self::PROFILE_IMAGES . $strFileName;
        return $objProfile->save();
    }

    public static function getTypeExt($strType)
    {
        switch ($strType) {
            case 'image/png' :
                return 'png';
            case 'image/jpeg' :
            case 'image/jpg' :
                return 'jpg';
        }
    }

    public static function getYouTubeImg($strVideoUrl)
    {
        //https://img.youtube.com/vi/wxpJeAhgUlw/
        //https://youtu.be
        if(preg_match('/https:\/\/(www)?.youtube.com\/watch\?v\=([a-z0-9A-Z\-\_]+)/',$strVideoUrl, $m)) {
            $strCode = $m[2];
        } elseif (preg_match('/https:\/\/youtu.be\/([a-z0-9A-Z\-\_]+)/',$strVideoUrl, $m)){
            $strCode = $m[1];
        }
        if(isset($strCode)) {
            return "https://img.youtube.com/vi/$strCode/0.jpg";
        }
        return '';
    }
}