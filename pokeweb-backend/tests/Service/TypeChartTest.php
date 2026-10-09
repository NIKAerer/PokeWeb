<?php

namespace App\Tests\Service;

use App\Service\TypeChart;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class TypeChartTest extends TestCase
{
    /**
     * @return iterable<string, array{string, string, ?string, float}>
     */
    public static function matchups(): iterable
    {
        yield 'Feu contre Plante : super efficace' => ['fire', 'grass', null, 2.0];
        yield 'Eau contre Feu : super efficace' => ['water', 'fire', null, 2.0];
        yield 'Feu contre Eau : peu efficace' => ['fire', 'water', null, 0.5];
        yield 'Normal contre Spectre : aucun effet' => ['normal', 'ghost', null, 0.0];
        yield 'Normal contre Normal : neutre' => ['normal', 'normal', null, 1.0];
        yield 'Glace contre Plante/Sol : les deux types se multiplient' => ['ice', 'grass', 'ground', 4.0];
        yield 'Plante contre Plante/Poison : 0.5 × 0.5' => ['grass', 'grass', 'poison', 0.25];
    }

    #[DataProvider('matchups')]
    public function testEffectiveness(string $attack, string $defender1, ?string $defender2, float $expected): void
    {
        $this->assertSame($expected, TypeChart::effectiveness($attack, $defender1, $defender2));
    }
}
