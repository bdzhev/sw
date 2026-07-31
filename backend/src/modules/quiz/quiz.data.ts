import { CharacterStat } from '@/shared/db/types';

export const quizData = [
  {
    id: '1',
    title: {
      en: 'Question 1',
      ru: 'Вопрос 1',
    },
    description: {
      en: "A merchant's cart lies overturned on the King's Road, his lockbox still chained to the wreckage. Crows circle above. From both ends of the road, you hear the clank of approaching armor.",
      ru: 'На Королевском тракте лежит перевёрнутая повозка торговца — его денежный ящик всё ещё прикован цепью к обломкам. Над головой кружат вороны. С обоих концов дороги доносится лязг приближающихся доспехов.',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} grabs the lockbox and slips into the undergrowth before either patrol rounds the bend.',
        },
        {
          value: CharacterStat.Int,
          label:
            "{characterName} examines the cart — the axle was sawed, not broken. The crows haven't touched the body. This was staged.",
        },
        {
          value: CharacterStat.Wis,
          label:
            "{characterName} kneels by the merchant and listens to the forest. The real threat isn't on the road.",
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} flips the cart on its side for cover, draws their weapon, and waits.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} drapes themselves over the cart in grief, wailing about their "dear uncle" — when the soldiers arrive, they\'ll be too busy consoling to ask questions.',
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} хватает денежный ящик и исчезает в зарослях прежде, чем патруль успевает завернуть за поворот.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} осматривает повозку — ось была перепилена, а не сломалась сама. Вороны не тронули тело. Это была инсценировка.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} опускается на колено рядом с торговцем и прислушивается к лесу. Настоящая угроза — не на дороге.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} переворачивает повозку набок, используя её как укрытие, обнажает оружие и ждёт.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} театрально падает на повозку в рыданиях, причитая о «дорогом дядюшке» — когда прибудут солдаты, им будет не до расспросов.',
        },
      ],
    },
  },
  {
    id: '2',
    title: {
      en: 'Question 2',
      ru: 'Вопрос 2',
    },
    description: {
      en: 'In the cellar of a dockside tavern, a grinning alchemist offers {characterName} a vial of glowing green liquid. "Ogre\'s Vitality," he calls it. Cures any ailment, he swears. His price is 200 gold, and his teeth are suspiciously perfect for a man who lives in a cellar.',
      ru: 'В подвале портовой таверны ухмыляющийся алхимик предлагает {characterName} склянку с мерцающей зелёной жидкостью. «Жизненная сила огра», — называет он её. Излечивает любой недуг, клянётся он. Цена — двести золотых, а зубы у него подозрительно безупречны для человека, живущего в подвале.',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} palms the vial with a quick hand while pretending to inspect the label.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} holds the vial to candlelight — if those are crushed faerie wings and not powdered emerald, this is a hallucinogen, not a cure.',
        },
        {
          value: CharacterStat.Wis,
          label:
            "{characterName} watches the alchemist's hands. A man who believes in his own product doesn't keep the antidote on his belt.",
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} leans in close, cracks their knuckles, and suggests the alchemist try a free sample first — right now.',
        },
        {
          value: CharacterStat.Cha,
          label:
            "{characterName} tells the alchemist they're the personal healer of a visiting duke who would buy a hundred vials — at wholesale price, naturally.",
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} ловким движением прячет склянку в ладони, делая вид, что изучает этикетку.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} подносит склянку к свече — если там перемолотые крылья фей, а не порошок изумруда, это галлюциноген, а не лекарство.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} следит за руками алхимика. Человек, верящий в собственный товар, не держит противоядие на поясе.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} наклоняется поближе, с хрустом разминает костяшки пальцев и предлагает алхимику самому попробовать бесплатный образец — прямо сейчас.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} сообщает алхимику, что является личным лекарем герцога в гостевом визите, который готов купить сотню склянок — по оптовой цене, разумеется.',
        },
      ],
    },
  },
  {
    id: '3',
    title: {
      en: 'Question 3',
      ru: 'Вопрос 3',
    },
    description: {
      en: "Your party camps near crumbling elven ruins. At midnight, a companion shakes {characterName} awake — a pale glow pulses deep within the ruin's entrance, and something inside is humming an ancient melody.",
      ru: 'Отряд разбивает лагерь близ полуразрушенных эльфийских руин. В полночь товарищ будит {characterName} — бледное свечение пульсирует в глубине у входа в руины, и что-то внутри напевает древнюю мелодию.',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} creeps toward the glow barefoot, pressing against the mossy stone walls, blade drawn.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} recognizes fragments of the melody — it follows an Old Elvish tonal pattern used in protective wards, not summoning.',
        },
        {
          value: CharacterStat.Wis,
          label:
            "{characterName} closes their eyes and feels the intent behind the melody. Malice has a texture, and this isn't it.",
        },
        {
          value: CharacterStat.Str,
          label:
            "{characterName} grabs their shield and a torch. Whatever haunts these stones can explain itself to {characterName}'s face.",
        },
        {
          value: CharacterStat.Cha,
          label:
            "{characterName} hums the melody back into the darkness. If it's sentient, a duet is a friendlier introduction than a sword.",
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} крадётся к свечению босиком, прижимаясь к покрытым мхом каменным стенам с обнажённым клинком.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} узнаёт фрагменты мелодии — она следует древнеэльфийскому тональному рисунку защитных заклятий, а не ритуалов призыва.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} закрывает глаза и чувствует намерение, стоящее за мелодией. У злобы есть своя фактура — и здесь её нет.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} хватает щит и факел. Чем бы ни был тот, кто тревожит эти камни, ему придётся объясниться с {characterName} лицом к лицу.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} напевает мелодию обратно во тьму. Если там есть разум, дуэт — куда более дружелюбное приветствие, чем меч.',
        },
      ],
    },
  },
  {
    id: '4',
    title: {
      en: 'Question 4',
      ru: 'Вопрос 4',
    },
    description: {
      en: 'A stone bridge spans a gorge — the only crossing for miles. On one side, sellswords flying a red banner. On the other, hooded figures bearing the mark of a fallen temple. Both are armed. Both are watching {characterName}. Neither has drawn steel yet.',
      ru: 'Каменный мост перекидывается через ущелье — единственная переправа на несколько лиг вокруг. По одну сторону — наёмники под красным стягом. По другую — фигуры в капюшонах с символом павшего храма. Оба отряда вооружены. Оба наблюдают за {characterName}. Никто пока не взялся за сталь.',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            "{characterName} drops below the bridge's edge and shimmies across the support arches. Let the two sides stare each other down.",
        },
        {
          value: CharacterStat.Int,
          label:
            "{characterName} counts blades, checks sight lines, notes the archers' quiver depth. There's a gap in their watch rotation in about four minutes.",
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} reads the tension — neither side has drawn first, which means neither wants to. {characterName} walks the bridge calmly. Hesitation is the only real danger here.',
        },
        {
          value: CharacterStat.Str,
          label:
            "{characterName} walks straight down the center of the bridge, hand on their weapon. Whoever draws first gets to find out why that's a mistake.",
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} approaches the nearest group with a grin: "The other side sent me to discuss terms. Lucky for both of you, {characterName} happens to be an excellent negotiator."',
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} соскальзывает за край моста и перебирается по опорным аркам снизу. Пусть две стороны сами буравят друг друга взглядами.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} пересчитывает клинки, проверяет линии обзора, замечает глубину колчанов лучников. В их смене дозора будет брешь примерно через четыре минуты.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} чувствует напряжение — ни одна из сторон не обнажила оружие первой, а значит, ни одна этого не хочет. {characterName} спокойно идёт по мосту. Промедление — единственная настоящая опасность здесь.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} идёт прямо по центру моста, положив руку на оружие. Тот, кто выхватит первым, узнает, почему это была ошибка.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} подходит к ближайшей группе с ухмылкой: «Другая сторона прислала меня обсудить условия. К вашему счастью, {characterName} — превосходный переговорщик».',
        },
      ],
    },
  },
  {
    id: '5',
    title: {
      en: 'Question 5',
      ru: 'Вопрос 5',
    },
    description: {
      en: 'The dragon sleeps atop a mountain of gold. Its breathing shakes dust from the ceiling. The artifact your patron needs is wedged beneath one massive claw.',
      ru: 'Дракон спит на вершине горы из золота. Его дыхание осыпает пыль с потолка. Артефакт, нужный покровителю, зажат под одной из огромных когтистых лап.',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            "{characterName} times the dragon's breathing cycle and slides under the claw during the deepest exhale.",
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} notices the artifact is magnetic — dragging a chain of gold coins toward the entrance could pull it free without touching the claw.',
        },
        {
          value: CharacterStat.Wis,
          label:
            "{characterName} watches the dragon's eyelids. The twitching pattern says it's dreaming, not faking. There's a window.",
        },
        {
          value: CharacterStat.Str,
          label:
            "{characterName} braces both hands under the claw and deadlifts. The dragon wakes, but the artifact is already in hand — now it's a footrace.",
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} begins narrating a soothing tale in Draconic. A deeper sleep means a longer window.',
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} засекает ритм дыхания дракона и скользит под лапу в момент самого глубокого выдоха.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} замечает, что артефакт магнитный — цепочка из золотых монет, протянутая к выходу, может вытащить его, не касаясь лапы.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} следит за веками дракона. Подёргивания говорят о том, что тот видит сны, а не притворяется. Есть окно.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} упирается обеими руками под лапу и поднимает её. Дракон просыпается, но артефакт уже в руках — теперь это гонка.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} начинает нашёптывать успокоительную сказку на Драконьем. Чем глубже сон — тем длиннее окно.',
        },
      ],
    },
  },
  {
    id: '6',
    title: {
      en: 'Question 6',
      ru: 'Вопрос 6',
    },
    description: {
      en: "The city guard has {characterName} in irons. A nobleman's jeweled dagger was found in {characterName}'s pack — planted, obviously. The trial is at dawn. The cell has a barred window, a drunk guard, and a rat.",
      ru: 'Городская стража заковала {characterName} в кандалы. В котомке {characterName} обнаружили украшенный самоцветами кинжал знатного господина — подброшенный, это очевидно. Суд на рассвете. В камере — зарешёченное окно, пьяный стражник и крыса.',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} works the irons loose with a hairpin and squeezes through the window gap before the guard finishes his bottle.',
        },
        {
          value: CharacterStat.Int,
          label:
            "{characterName} recalls that this city's legal code has an old clause — trial by riddle. The judge can't refuse if the accused invokes it by name.",
        },
        {
          value: CharacterStat.Wis,
          label:
            "{characterName} studies the drunk guard. That's not laziness — it's guilt. He knows the dagger was planted, and the right question will crack him open.",
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} snaps the chain between the irons, bends the window bars apart, and drops into the alley below.',
        },
        {
          value: CharacterStat.Cha,
          label:
            "{characterName} calls the guard over and explains, in vivid detail, what the nobleman's rivals will do once they hear about this sloppy frame job. Suddenly, the guard is very motivated to help.",
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} разрабатывает кандалы шпилькой и протискивается в оконный проём прежде, чем стражник успевает допить бутылку.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} вспоминает, что в городском своде законов есть старая статья — суд через загадку. Судья не вправе отказать, если обвиняемый назовёт её по имени.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} изучает пьяного стражника. Это не лень — это вина. Он знает, что кинжал был подброшен, и правильный вопрос его сломит.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} разрывает цепь между кандалами, гнёт оконные прутья в стороны и прыгает в переулок внизу.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} подзывает стражника и во всех красках объясняет, что сделают с ним соперники дворянина, когда услышат о столь топорной подставе. Внезапно стражник очень заинтересован в помощи.',
        },
      ],
    },
  },
  {
    id: '7',
    title: {
      en: 'Question 7',
      ru: 'Вопрос 7',
    },
    description: {
      en: 'The village well has turned black. Crops are withering. The elder begs {characterName} for help, but warns that the last three adventurers who climbed down never came back.',
      ru: 'Деревенский колодец почернел. Урожай засыхает. Старейшина умоляет {characterName} о помощи, но предупреждает: трое последних искателей приключений, спустившихся туда, не вернулись.',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} rigs a rope harness with a quick-release knot and descends silently, ready to cut and drop at the first sign of danger.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} takes a water sample first. The discoloration pattern and sulfur smell suggest a ruptured ley line, not a creature — which changes the approach entirely.',
        },
        {
          value: CharacterStat.Wis,
          label:
            "{characterName} sits by the well and listens. Three adventurers went down armed for a fight. Maybe what's down there doesn't want a fight.",
        },
        {
          value: CharacterStat.Str,
          label:
            "{characterName} rips the well's stone cap off with both hands and hurls a torch into the shaft. Whatever's down there can meet {characterName} on fair terms.",
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} gathers the villagers and announces that the well spirit clearly wants tribute. A dramatic ceremony with chanting and candles might be nonsense — but scared things respond to respect.',
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} вяжет верёвочную обвязку с быстроразъёмным узлом и беззвучно спускается вниз, готовый обрезать верёвку при первом признаке опасности.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} сначала берёт пробу воды. Характер обесцвечивания и запах серы указывают на разрыв линии лей, а не на существо — а это полностью меняет подход.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} садится у колодца и прислушивается. Три искателя спустились туда с оружием, готовые к бою. Возможно, то, что там внизу, вовсе не хочет драться.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} срывает каменную крышку колодца обеими руками и швыряет факел в шахту. Что бы там ни было — пусть встретится с {characterName} на равных.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} собирает деревенских жителей и объявляет, что дух колодца явно требует подношения. Торжественный обряд с песнопениями и свечами может быть и выдумкой — но испуганные существа откликаются на уважение.',
        },
      ],
    },
  },
  {
    id: '8',
    title: {
      en: 'Question 8',
      ru: 'Вопрос 8',
    },
    description: {
      en: "Arrows thud into the dirt at {characterName}'s feet. Above, on both canyon walls, a dozen goblins are howling and nocking fresh arrows. The canyon is narrow. There is no going back.",
      ru: 'Стрелы вонзаются в землю у ног {characterName}. Сверху, на обоих склонах ущелья, дюжина гоблинов воет и натягивает новые стрелы. Ущелье узкое. Пути назад нет.',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} rolls behind a fallen boulder and sprints from cover to cover, zigzagging through the killzone.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} spots the loose shale on the left wall. One well-placed strike at the base and the whole ledge takes half the goblins with it.',
        },
        {
          value: CharacterStat.Wis,
          label:
            "{characterName} freezes and scans the formation. Goblins don't ambush without a boss — find the one giving signals and the rest lose coordination.",
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} picks up the nearest boulder, hurls it at the canyon wall, and charges through the rockslide of panicking goblins.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} raises both hands and screams in Goblin: "Your chief promised me safe passage! Who among you wants to explain this to them?"',
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} перекатывается за упавший валун и мчится от укрытия к укрытию зигзагом сквозь зону поражения.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} замечает осыпающийся сланец на левом склоне. Один точный удар в основание — и весь выступ унесёт с собой половину гоблинов.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} замирает и обшаривает взглядом строй. Гоблины не устраивают засаду без командира — найди того, кто подаёт сигналы, и остальные потеряют слаженность.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} поднимает ближайший валун, швыряет его в стену ущелья и прорывается через камнепад и обезумевших гоблинов.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} поднимает обе руки и кричит на Гоблинском: «Ваш вождь обещал мне безопасный проход! Кто из вас хочет объяснить ему это?»',
        },
      ],
    },
  },
  {
    id: '9',
    title: {
      en: 'Question 9',
      ru: 'Вопрос 9',
    },
    description: {
      en: 'A knight in battered armor leans against a milestone, bleeding out. They press a sealed letter into {characterName}\'s hands and whisper: "The duke must never see this." Then their eyes go still. Hoofbeats approach.',
      ru: 'Рыцарь в побитых доспехах опирается на межевой камень, истекая кровью. Он вкладывает запечатанное письмо в руки {characterName} и шепчет: «Герцог никогда не должен увидеть этого». Затем его взгляд стекленеет. Приближается топот копыт.',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            "{characterName} pockets the letter, closes the knight's visor, and vanishes into the treeline in three heartbeats.",
        },
        {
          value: CharacterStat.Int,
          label:
            "{characterName} breaks the seal and speed-reads the contents. Knowing what the duke isn't supposed to see determines everything about what happens next.",
        },
        {
          value: CharacterStat.Wis,
          label:
            "{characterName} looks into the knight's eyes in that final moment. The fear isn't about dying — it's about the letter. This is bigger than a message.",
        },
        {
          value: CharacterStat.Str,
          label:
            "{characterName} hoists the knight's body over one shoulder and their shield in the other hand. Whoever's riding in will have to go through {characterName} first.",
        },
        {
          value: CharacterStat.Cha,
          label:
            "{characterName} kneels beside the knight, arranges the scene solemnly, and when the riders arrive, introduces themselves as the knight's sworn squire carrying out their final wish.",
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} прячет письмо, опускает забрало рыцаря и растворяется в кромке леса за три удара сердца.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} вскрывает печать и скоро пробегает взглядом содержимое. Знать, чего герцог не должен видеть, — значит понимать всё, что будет дальше.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} смотрит в глаза рыцаря в последний миг. Страх в них — не от смерти, а от письма. Это нечто большее, чем просто послание.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} взваливает тело рыцаря на одно плечо, в другую руку берёт щит. Кто бы ни скакал сюда — ему придётся пройти через {characterName}.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} опускается на колено рядом с рыцарем, торжественно устраивает сцену и, когда всадники прибывают, представляется поклявшимся оруженосцем рыцаря, выполняющим его последнюю волю.',
        },
      ],
    },
  },
  {
    id: '10',
    title: {
      en: 'Question 10',
      ru: 'Вопрос 10',
    },
    description: {
      en: 'Deep in a sorcerer\'s tower, {characterName} finds a mirror that doesn\'t show their reflection — it shows a version of {characterName} that made every right choice. Stronger, wiser, crowned. The reflection reaches out a hand and whispers: "Step through."',
      ru: 'В глубине башни чародея {characterName} находит зеркало, которое не отражает его самого — оно показывает версию {characterName}, принявшего каждое верное решение. Сильнее, мудрее, в короне. Отражение протягивает руку и шепчет: «Переступи».',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            "{characterName} checks the mirror's edges for hinges, clasps, runes — anything that reveals what it actually is before touching a thing.",
        },
        {
          value: CharacterStat.Int,
          label:
            "{characterName} studies the reflection's crown — the gemstone arrangement is an enchantment sequence. This isn't a portal, it's a soul trap.",
        },
        {
          value: CharacterStat.Wis,
          label:
            "{characterName} meets the reflection's eyes and feels the pull. It's desire, not truth. The best version of {characterName} wouldn't need a trick mirror.",
        },
        {
          value: CharacterStat.Str,
          label:
            "{characterName} punches the mirror. Shattering the glass shatters the spell, and whatever's on the other side can stay there.",
        },
        {
          value: CharacterStat.Cha,
          label:
            "{characterName} smiles back at the reflection and says: \"If you're really me, you'd know I never take a deal I didn't negotiate first. Let's talk terms.\"",
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} проверяет края зеркала на петли, застёжки, руны — всё, что раскроет его истинную природу, прежде чем к нему прикоснуться.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} изучает корону отражения — расположение самоцветов представляет собой последовательность чар. Это не портал, а ловушка для душ.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} встречается с отражением взглядом и чувствует притяжение. Это желание, а не правда. Лучшая версия {characterName} не нуждалась бы в зеркале-обманке.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} бьёт кулаком в зеркало. Разбитое стекло разрушает чары, а то, что было по ту сторону, пусть там и остаётся.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} улыбается отражению в ответ и говорит: «Если ты и правда я — ты знаешь, что я никогда не принимаю сделку, которую сам не обговорил. Давай обсудим условия».',
        },
      ],
    },
  },
  {
    id: '11',
    title: {
      en: 'Question 11',
      ru: 'Вопрос 11',
    },
    description: {
      en: 'The ship is going down in a storm. {characterName} can see jagged rocks, a distant beach, and a sea cave lit from within. The lifeboat fits four — there are seven of you.',
      ru: 'Корабль тонет в шторм. {characterName} видит острые скалы, далёкий берег и морскую пещеру, светящуюся изнутри. В шлюпку помещается четверо — а вас семеро.',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} lashes two barrels together as a makeshift raft, ties a guideline to the lifeboat, and surfs the wave gap between the rocks.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} calculates the current, the wind direction, and the distance — the sea cave has calmer water. Aim for the cave, not the beach.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} looks at the seven faces. Panic kills faster than waves. Calm the crew first, then the sea will sort itself out.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} grabs the hull breach with both arms and holds the planks together long enough for everyone to board the lifeboat.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} takes command with a voice that cuts through the storm: "You, bail water. You two, row left. Nobody dies tonight, I promise you that."',
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} скрепляет два бочонка в импровизированный плот, привязывает страховочный трос к шлюпке и сёрфингует в просвет между волнами у скал.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} просчитывает течение, направление ветра и расстояние — в морской пещере вода спокойнее. Курс на пещеру, не на берег.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} смотрит на семь лиц. Паника убивает быстрее волн. Сначала успокоить команду — море само разберётся.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} охватывает пробоину в корпусе обеими руками и удерживает доски вместе достаточно долго, чтобы все успели сесть в шлюпку.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} берёт командование голосом, пробивающимся сквозь шторм: «Ты — откачивай воду. Вы двое — гребите влево. Этой ночью никто не умрёт, обещаю».',
        },
      ],
    },
  },
  {
    id: '12',
    title: {
      en: 'Question 12',
      ru: 'Вопрос 12',
    },
    description: {
      en: 'The treasure chest at the end of the dungeon has unusually clean hinges. {characterName} notices it just barely... breathing.',
      ru: 'Сундук с сокровищами в конце подземелья имеет подозрительно чистые петли. {characterName} замечает, что тот едва заметно... дышит.',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            "{characterName} flicks a coin at the lid from ten paces back and readies a dodge. Let it reveal itself on {characterName}'s terms.",
        },
        {
          value: CharacterStat.Int,
          label:
            "{characterName} recalls that mimics have a glandular weakness behind their hinge-jaw. One precise strike there and it's paralyzed.",
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} felt something was wrong two rooms ago. The dungeon was too easy. This whole room is the trap — not just the chest.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} grabs the chest by its lid and slams it into the stone floor before it can fully transform.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} sits down in front of the chest and starts talking. "I know what you are. Must be lonely down here. How about a deal — I feed you the next group, you let me pass."',
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} щелчком отправляет монету в крышку с расстояния десяти шагов и изготавливается к уклонению. Пусть раскроет себя на условиях {characterName}.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} вспоминает, что у мимиков есть железистая слабость за суставом-челюстью. Один точный удар туда — и он парализован.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} почувствовал неладное ещё два зала назад. Подземелье было слишком лёгким. Вся эта комната — ловушка, а не только сундук.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} хватает сундук за крышку и с силой швыряет его о каменный пол прежде, чем тот успевает полностью превратиться.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} садится перед сундуком и начинает говорить. «Я знаю, кто ты. Должно быть, здесь одиноко. Как насчёт сделки — я скармливаю тебе следующую группу, ты пропускаешь меня».',
        },
      ],
    },
  },
  {
    id: '13',
    title: {
      en: 'Question 13',
      ru: 'Вопрос 13',
    },
    description: {
      en: 'The corridor splits into three paths. Above the left: a carving of an open eye. Above the center: a carving of a clenched fist. Above the right: nothing — just scratch marks where a carving was chiseled away.',
      ru: 'Коридор разветвляется на три пути. Над левым — резной открытый глаз. Над центральным — резной сжатый кулак. Над правым — ничего: лишь царапины там, где резьба была сбита долотом.',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} checks the floor dust in each corridor. The path with the most foot traffic is the one previous explorers survived.',
        },
        {
          value: CharacterStat.Int,
          label:
            "{characterName} studies the scratch marks — the chisel pattern is recent, not ancient. Someone wanted to hide where the third path leads. That's the important one.",
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} stands at the junction and breathes. Air moves differently through trapped corridors. One of these paths exhales.',
        },
        {
          value: CharacterStat.Str,
          label:
            "{characterName} picks the center path — the fist. Whatever's down there was meant for someone who doesn't flinch.",
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} shouts down all three corridors and listens. If anything sentient is down there, the echo will carry a reaction.',
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} проверяет пыль на полу в каждом из коридоров. Путь с наибольшими следами ног — тот, из которого предыдущие исследователи вышли живыми.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} изучает царапины — узор от долота свежий, не древний. Кто-то хотел скрыть, куда ведёт третий путь. Значит, он и есть важный.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} останавливается на развилке и дышит. В коридорах с ловушками воздух движется иначе. Один из этих путей выдыхает.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} выбирает центральный путь — кулак. То, что там внизу, было предназначено для того, кто не дрогнет.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} кричит в все три коридора и прислушивается. Если там есть что-то разумное, эхо донесёт реакцию.',
        },
      ],
    },
  },
  {
    id: '14',
    title: {
      en: 'Question 14',
      ru: 'Вопрос 14',
    },
    description: {
      en: 'The Archfey\'s banquet table groans under impossible food — fruits that glow, wine that sings, a roast that smells like your happiest memory. The Archfey smiles and gestures: "Eat. You are my guest." Everyone knows eating fey food binds you.',
      ru: 'Пиршественный стол Архифея ломится под невозможной едой — светящимися фруктами, поющим вином, жарким, пахнущим твоим счастливейшим воспоминанием. Архифей улыбается и делает приглашающий жест: «Ешь. Ты мой гость». Все знают: вкусить пищу фей — значит связать себя навеки.',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} palms a glowing fruit into a pouch while miming eating. The Archfey sees what they want to see.',
        },
        {
          value: CharacterStat.Int,
          label:
            "{characterName} knows the binding clause requires willing consumption. Technically, if the food enters {characterName}'s mouth by the Archfey's own hand, the contract is void. Time to provoke a very specific reaction.",
        },
        {
          value: CharacterStat.Wis,
          label:
            "{characterName} watches the other guests. The ones who've been here longest have a glaze in their eyes. That's not joy — it's a leash.",
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} flips the entire table. Fey contracts require a calm exchange — chaos voids the courtesy, and the courtesy is the cage.',
        },
        {
          value: CharacterStat.Cha,
          label:
            "{characterName} raises a glass, locks eyes with the Archfey, and proposes a toast to their host's legendary generosity — buying time while shifting the power dynamic to mutual flattery.",
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} незаметно прячет светящийся фрукт в кошель, изображая трапезу. Архифей видит то, что хочет видеть.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} знает: условие договора требует добровольного поглощения. Технически если еда попадёт в рот {characterName} рукой самого Архифея — контракт недействителен. Пора спровоцировать вполне определённую реакцию.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} наблюдает за другими гостями. У тех, кто здесь дольше всего, в глазах стоит туман. Это не радость — это поводок.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} переворачивает весь стол. Договоры фей требуют спокойного обмена — хаос упраздняет учтивость, а учтивость и есть клетка.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} поднимает бокал, встречается с Архифеем взглядом и предлагает тост во славу легендарной щедрости хозяина — выигрывая время и смещая баланс сил в сторону взаимной лести.',
        },
      ],
    },
  },
  {
    id: '15',
    title: {
      en: 'Question 15',
      ru: 'Вопрос 15',
    },
    description: {
      en: "A stone golem fills the corridor, eyes glowing faintly. It hasn't attacked — but it also hasn't moved. Behind it, {characterName} can see the faint shimmer of the portal home.",
      ru: 'Каменный голем заполняет коридор, его глаза слабо светятся. Он не нападал — но и не двигался. За ним {characterName} видит едва заметное мерцание портала домой.',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            "{characterName} spots a gap between the golem's leg and the wall — just enough to slide through without making contact.",
        },
        {
          value: CharacterStat.Int,
          label:
            "{characterName} reads the runes on the golem's chest. It's a command sequence — one wrong syllable activates it, but the right one steps it aside.",
        },
        {
          value: CharacterStat.Wis,
          label:
            "{characterName} stands still and observes. The golem hasn't attacked because the trigger isn't proximity — it's intent. Approach without aggression.",
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} lowers their shoulder and shoves the golem sideways. Stone grinds against stone, but the gap widens.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} speaks to the golem as though addressing a loyal servant: "Your master sent me. Step aside, guardian. Your watch is over."',
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} замечает просвет между ногой голема и стеной — ровно достаточно, чтобы проскользнуть, не касаясь его.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} читает руны на груди голема. Это командная последовательность — один неверный слог активирует его, но правильный заставит отступить в сторону.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} замирает и наблюдает. Голем не напал, потому что триггер — не близость, а намерение. Приближаться без агрессии.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} опускает плечо и толкает голема в сторону. Камень скрежещет о камень, но просвет расширяется.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} обращается к голему как к верному слуге: «Твой хозяин послал меня. Отступи, страж. Твоя вахта окончена».',
        },
      ],
    },
  },
  {
    id: '16',
    title: {
      en: 'Question 16',
      ru: 'Вопрос 16',
    },
    description: {
      en: 'The dungeon is collapsing. Dust and stone rain from the ceiling. Ahead, the exit — but a massive stone slab is sliding shut. {characterName} has seconds.',
      ru: 'Подземелье рушится. С потолка сыплются пыль и камни. Впереди — выход, но массивная каменная плита медленно закрывается. У {characterName} — секунды.',
    },
    answers: {
      en: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} dives and rolls through the narrowing gap, scraping through just as the slab seals shut.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} spots the counterweight mechanism — one strike to the exposed chain and the slab reverses direction.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} pauses for a half-second, reads the rhythm of the collapse, and times the run perfectly between falling stones.',
        },
        {
          value: CharacterStat.Str,
          label:
            "{characterName} catches the slab's edge and holds it open with everything they've got, muscles screaming, until they force themselves through.",
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} screams a command at the party to move NOW with such authority that even the hesitant ones sprint without thinking — and {characterName} is right behind them.',
        },
      ],
      ru: [
        {
          value: CharacterStat.Dex,
          label:
            '{characterName} бросается вперёд и перекатывается в сужающийся просвет, проскальзывая в последний момент, когда плита смыкается.',
        },
        {
          value: CharacterStat.Int,
          label:
            '{characterName} замечает противовесный механизм — один удар по открытой цепи, и плита идёт в обратном направлении.',
        },
        {
          value: CharacterStat.Wis,
          label:
            '{characterName} на полсекунды замирает, улавливает ритм обрушения и выбирает момент для рывка между падающими камнями.',
        },
        {
          value: CharacterStat.Str,
          label:
            '{characterName} хватается за край плиты и удерживает её изо всех сил, когда мышцы уже кричат, — достаточно долго, чтобы протиснуться.',
        },
        {
          value: CharacterStat.Cha,
          label:
            '{characterName} командует отряду двигаться СЕЙЧАС с такой властностью, что даже самые нерешительные срываются с места не раздумывая — а {characterName} замыкает.',
        },
      ],
    },
  },
];
