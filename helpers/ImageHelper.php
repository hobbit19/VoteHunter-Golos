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

    const COVER_IMAGES = '/assets/images/cover/';
    const PROFILE_IMAGES = '/assets/images/profile/';

    public static function processCoverImage($objImage)
    {
        /* @var $objImage UploadedFile*/
        $strFileName = \Yii::$app->user->getId().'/'.time().'.' . $objImage->extension;
//        if(!is_dir(\Yii::getAlias('@app/frontend'). self::COVER_IMAGES. \Yii::$app->user->getId())) {
//            mkdir(\Yii::getAlias('@app/frontend'). self::COVER_IMAGES. \Yii::$app->user->getId(),0777, true);
//        }
        if(!is_dir(\Yii::getAlias('@webroot'). self::COVER_IMAGES. \Yii::$app->user->getId())) {
            mkdir(\Yii::getAlias('@webroot'). self::COVER_IMAGES. \Yii::$app->user->getId(),0777, true);
        }

//        copy($objImage->tempName, \Yii::getAlias('@app/frontend'). self::COVER_IMAGES . $strFileName);
        copy($objImage->tempName, \Yii::getAlias('@webroot'). self::COVER_IMAGES . $strFileName);
        $objProfile = Profile::findOne(['user_id' => \Yii::$app->user->getId()]);
        $objProfile->cover_image = self::COVER_IMAGES . $strFileName;
        return $objProfile->save();
    }

    public static function processProfileImage($objImage)
    {
        /* @var $objImage UploadedFile*/
        $strFileName = \Yii::$app->user->getId().'/'.time().'.' . $objImage->extension;
//        if(!is_dir(\Yii::getAlias('@app/frontend'). self::PROFILE_IMAGES. \Yii::$app->user->getId())) {
//            mkdir(\Yii::getAlias('@app/frontend'). self::PROFILE_IMAGES. \Yii::$app->user->getId(),0777, true);
//        }
        if(!is_dir(\Yii::getAlias('@webroot'). self::PROFILE_IMAGES. \Yii::$app->user->getId())) {
            mkdir(\Yii::getAlias('@webroot'). self::PROFILE_IMAGES. \Yii::$app->user->getId(),0777, true);
        }
//        copy($objImage->tempName, \Yii::getAlias('@app/frontend'). self::PROFILE_IMAGES . $strFileName);
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
}