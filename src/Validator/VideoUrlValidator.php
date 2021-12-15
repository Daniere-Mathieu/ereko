<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use App\Entity\Track;

class VideoUrlValidator extends ConstraintValidator
{
    public function validate($url, Constraint $constraint)
    {
        /* @var $constraint \App\Validator\VideoUrl */

        if (null === $url || '' === $url) {
            return;
        }

        if (preg_match(self::video_url_regex(), $url)) {
            return;
        }

        $this->context->buildViolation($constraint->message)
            ->setParameter('{{ video_url }}', $url)
            ->addViolation();
    }

    private static function video_url_regex(){
        return "#^https://youtu.be/" . Track::$track_id_regex . "$#";
    }
}
