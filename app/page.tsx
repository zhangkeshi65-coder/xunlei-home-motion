'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { motionParticles } from './resultMotionData';

const ASSETS = {
  background: './assets/background.png',
  bookmark: './assets/bookmark.png',
  cloud: './assets/cloud.png',
  history: './assets/history.png',
  cardArt: './assets/card-art.png',
  object: './assets/object.png',
  ellipseTop: './assets/ellipse-top.svg',
  ellipseBottom: './assets/ellipse-bottom.svg',
  logo: './assets/logo.svg',
  add: './assets/add.svg',
  scan: './assets/scan.svg',
  magic: './assets/magic.svg',
  popupGradient: './assets/popup/header-gradient.png',
  popupCards: './assets/popup/header-cards.png',
  popupTitle: './assets/popup/title.svg',
  popupStarLarge: './assets/popup/star-large.svg',
  popupStarSmall: './assets/popup/star-small.svg',
  popupClose: './assets/popup/close.svg',
  popupRefresh: './assets/popup/refresh.svg',
  popupButtonFrame: './assets/popup/button-frame.svg',
  popupButtonMask: './assets/popup/button-mask.svg',
  popupButtonLine: './assets/popup/button-line.svg',
  popupButtonTexture: './assets/popup/button-texture.png',
  popupButtonTop: './assets/popup/button-top.svg',
  popupButtonBottom: './assets/popup/button-bottom.svg',
  popupButtonSideLeft: './assets/popup/button-side-left.svg',
  popupButtonSideRight: './assets/popup/button-side-right.svg',
  popupButtonTopLeft: './assets/popup/button-top-left.svg',
  popupButtonTopRight: './assets/popup/button-top-right.svg',
  popupButtonEdgeLeft: './assets/popup/button-edge-left.svg',
  popupButtonEdgeRight: './assets/popup/button-edge-right.svg',
  resultCard: './assets/result/card.png',
  resultCardFront: './assets/result/art-original.png',
  resultTopLight: './assets/result/effects/top-light.svg',
  resultCardHalo: './assets/result/effects/card-halo.svg',
  resultTitle: './assets/result/title.svg',
  resultStroke: './assets/result/caption.svg',
  detailLight: './assets/detail/light-texture.jpg',
  detailFrame: './assets/detail/ornate-frame.svg',
  detailBadge: './assets/detail/position-badge.svg',
  detailCrown: './assets/detail/section-crown.svg',
  detailDownload: './assets/detail/download.png',
  detailLightOverlay: './assets/detail/light-overlay.png',
  shareScreen: './assets/share/screen.png',
  shareScreenPreview: './assets/share/screen-preview.png',
  shareCardHd: './assets/share/card-hd.png',
} as const;

const sharePulseTransition = {
  scaleX: {
    duration: 6.003,
    times: [0, 0.0999, 0.1999, 0.2998, 0.3998, 0.4997, 0.5997, 0.6996, 0.7995, 0.8995, 0.9994, 1],
    ease: ['easeInOut', 'easeInOut', 'easeInOut', 'easeInOut', 'easeInOut', 'easeInOut', 'easeInOut', 'easeInOut', 'easeInOut', 'easeInOut', 'linear'],
    repeat: Infinity,
  },
  scaleY: {
    duration: 6.003,
    times: [0, 0.0999, 0.1999, 0.2998, 0.3998, 0.4997, 0.5997, 0.6996, 0.7995, 0.8995, 0.9994, 1],
    ease: ['easeInOut', 'easeInOut', 'easeInOut', 'easeInOut', 'easeInOut', 'easeInOut', 'easeInOut', 'easeInOut', 'easeInOut', 'easeInOut', 'linear'],
    repeat: Infinity,
  },
} as const;

const shortcuts = [
  { label: '书签', icon: ASSETS.bookmark },
  { label: '云盘', icon: ASSETS.cloud },
  { label: '历史', icon: ASSETS.history },
  { label: '', icon: ASSETS.add },
] as const;

const springEase = (t: number) =>
  1 -
  Math.exp(-t * 7.2105) *
    (Math.cos(t * 20.3943) + 0.3536 * Math.sin(t * 20.3943));

const objectTransition = {
  opacity: {
    duration: 1.915,
    times: [0, 0.1243, 0.1883, 1],
    ease: ['linear', [0.5, 0, 0.5, 1], 'linear'],
  },
  scaleX: {
    duration: 1.915,
    times: [0, 0.1023, 0.204, 0.768, 1],
    ease: ['linear', [0.15, 0.85, 0.3, 1], springEase, 'linear'],
  },
  scaleY: {
    duration: 1.915,
    times: [0, 0.1023, 0.204, 0.768, 1],
    ease: ['linear', [0.15, 0.85, 0.3, 1], springEase, 'linear'],
  },
  x: {
    duration: 1.915,
    times: [0, 0.1023, 0.1883, 1],
    ease: ['linear', [0.58, 0.26, 1, 1], 'linear'],
  },
  y: {
    duration: 1.915,
    times: [0, 0.1023, 0.1883, 0.204, 0.768, 1],
    ease: [
      'linear',
      [0.58, 0.26, 1, 1],
      [0.15, 0.85, 0.3, 1],
      springEase,
      'linear',
    ],
  },
} as const;

const magicTransition = {
  opacity: {
    duration: 1.915,
    times: [0, 0.4188, 0.4606, 1],
    ease: ['linear', [0.5, 0, 0.5, 1], 'linear'],
  },
  scaleX: {
    duration: 1.915,
    times: [0, 0.4711, 0.4867, 0.7479, 0.9999, 1],
    ease: ['linear', [0.15, 0.85, 0.3, 1], 'linear', 'linear', 'linear'],
  },
  scaleY: {
    duration: 1.915,
    times: [0, 0.4711, 0.4867, 0.7479, 0.9999, 1],
    ease: ['linear', [0.15, 0.85, 0.3, 1], 'linear', 'linear', 'linear'],
  },
  y: {
    duration: 1.915,
    times: [0, 0.4188, 0.4711, 0.4867, 0.7479, 0.9999, 1],
    ease: [
      'linear',
      [0.58, 0.26, 1, 1],
      [0.15, 0.85, 0.3, 1],
      'linear',
      'linear',
      'linear',
    ],
  },
} as const;

const topics = ['考试/学习', '情感/沟通', '求职/实习', '生活/状态'] as const;
type Topic = (typeof topics)[number];

const questionSuggestions = [
  '例如：我今天的运气怎么样？',
  '例如：这件事我下一步应该怎么做？',
  '例如：最近让我困扰的原因是什么？',
  '例如：我该如何调整现在的状态？',
  '例如：这段关系里，我忽略了什么？',
  '例如：我该怎样和对方更好地沟通？',
  '例如：我应该如何准备这次考试？',
  '例如：这份工作适合现在的我吗？',
  '例如：最近有什么值得期待的事情？',
  '例如：我现在最需要放下什么？',
  '例如：今天可以给自己什么提醒？',
] as const;

function TopicStar() {
  return (
    <span className="topic-star" aria-hidden="true">
      <img src={ASSETS.popupStarLarge} alt="" />
      <img src={ASSETS.popupStarSmall} alt="" />
    </span>
  );
}

function DrawButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      className="draw-button"
      type="button"
      data-node-id="5:2163"
      disabled={disabled}
      onClick={onClick}
    >
      <img className="draw-frame" src={ASSETS.popupButtonFrame} alt="" />
      <span
        className="draw-texture draw-texture-a"
        style={{ maskImage: `url(${ASSETS.popupButtonMask})` }}
      />
      <span
        className="draw-texture draw-texture-b"
        style={{ maskImage: `url(${ASSETS.popupButtonMask})` }}
      />
      <img className="draw-line" src={ASSETS.popupButtonLine} alt="" />
      <img className="draw-top" src={ASSETS.popupButtonTop} alt="" />
      <img className="draw-bottom" src={ASSETS.popupButtonBottom} alt="" />
      <img className="draw-top-left" src={ASSETS.popupButtonTopLeft} alt="" />
      <img className="draw-top-right" src={ASSETS.popupButtonTopRight} alt="" />
      <img className="draw-side-left" src={ASSETS.popupButtonSideLeft} alt="" />
      <img className="draw-side-right" src={ASSETS.popupButtonSideRight} alt="" />
      <img className="draw-edge-left" src={ASSETS.popupButtonEdgeLeft} alt="" />
      <img className="draw-edge-right" src={ASSETS.popupButtonEdgeRight} alt="" />
      <span className="draw-label">抽一张</span>
    </button>
  );
}

function FortunePopup({
  onClose,
  onDraw,
  reduceMotion,
  selectedTopic,
  onSelectTopic,
  question,
  onQuestionChange,
}: {
  onClose: () => void;
  onDraw: () => void;
  reduceMotion: boolean;
  selectedTopic: Topic | null;
  onSelectTopic: (topic: Topic) => void;
  question: string;
  onQuestionChange: (question: string) => void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);

  const chooseAnotherQuestion = () => {
    let nextIndex = questionIndex;
    while (nextIndex === questionIndex) {
      nextIndex = Math.floor(Math.random() * questionSuggestions.length);
    }
    setQuestionIndex(nextIndex);
    onQuestionChange(questionSuggestions[nextIndex]);
  };

  const scrimTransition = {
    opacity: {
      duration: 1.915,
      times: [0, 0.2089, 1],
      ease: ['easeOut', 'linear'],
    },
  } as const;
  const sheetTransition = {
    opacity: {
      duration: 1.915,
      times: [0, 0.1567, 1],
      ease: ['easeOut', 'linear'],
    },
    y: {
      duration: 1.915,
      times: [0, 0.2611, 1],
      ease: [[0.16, 1, 0.3, 1], 'linear'],
    },
  } as const;

  return (
    <>
      <motion.div
        className="popup-scrim"
        data-node-id="5:2315"
        initial={{ opacity: reduceMotion ? 1 : 0 }}
        animate={{ opacity: reduceMotion ? 1 : [0, 1, 1] }}
        transition={reduceMotion ? { duration: 0 } : scrimTransition}
        aria-hidden="true"
      />
      <motion.section
        className="fortune-popup"
        data-node-id="5:2316"
        initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 575 }}
        animate={{ opacity: reduceMotion ? 1 : [0, 1, 1], y: reduceMotion ? 0 : [575, 0, 0] }}
        transition={reduceMotion ? { duration: 0 } : sheetTransition}
        role="dialog"
        aria-modal="true"
        aria-label="今日灵感卡"
      >
        <img className="popup-gradient" src={ASSETS.popupGradient} alt="" />

        <div className="popup-heading" data-node-id="5:2318">
          <img className="popup-cards" src={ASSETS.popupCards} alt="" aria-hidden="true" />
          <img className="popup-title" src={ASSETS.popupTitle} alt="今日灵感卡" />
        </div>

        <button className="popup-close" type="button" onClick={onClose} aria-label="关闭弹窗">
          <img src={ASSETS.popupClose} alt="" />
        </button>

        <label className="question-label" htmlFor="fortune-question">写下你的问题</label>
        <div className="question-box">
          <input
            id="fortune-question"
            value={question}
            onChange={(event) => onQuestionChange(event.target.value)}
            aria-label="抽卡问题"
          />
          <button type="button" aria-label="换一个问题" onClick={chooseAnotherQuestion}>
            <img src={ASSETS.popupRefresh} alt="" />
          </button>
        </div>

        <p className="topics-label">热门话题</p>
        <div className="topic-grid">
          {topics.map((topic) => (
            <button
              className={`topic-button${selectedTopic === topic ? ' topic-button-selected' : ''}`}
              type="button"
              key={topic}
              aria-pressed={selectedTopic === topic}
              onClick={() => onSelectTopic(topic)}
            >
              <TopicStar />
              <span>{topic}</span>
            </button>
          ))}
        </div>

        <DrawButton disabled={!selectedTopic} onClick={onDraw} />
        <p className="popup-disclaimer">Ai生成内容仅用于娱乐与自我探索</p>
      </motion.section>
    </>
  );
}

const resultCards = Array.from({ length: 19 }, (_, index) => index);

const RESULT_DURATION = 4.2;

const resultFadeTransition = {
  opacity: {
    duration: RESULT_DURATION,
    times: [0, .1455, .2727, 1],
    ease: ['linear', 'easeOut', 'linear'],
  },
} as const;

function ResultParticles({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="result-particles" aria-hidden="true">
      {motionParticles.map((particle) => {
        const isSparkle = particle.name.startsWith('Sparkle');
        return (
          <motion.img
            key={particle.id}
            className={isSparkle ? 'result-sparkle' : 'result-bokeh'}
            src={particle.src}
            alt=""
            style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
            initial={reduceMotion ? { opacity: isSparkle ? 0 : .45 } : { opacity: 0, x: 0, y: 0, scale: isSparkle ? .3 : 1 }}
            animate={reduceMotion ? { opacity: isSparkle ? 0 : .45 } : {
              opacity: [...particle.opacity],
              x: particle.x ? [...particle.x] : 0,
              y: particle.y ? [...particle.y] : 0,
              scale: particle.scale ? [...particle.scale] : 1,
            }}
            transition={reduceMotion ? { duration: 0 } : {
              opacity: { duration: RESULT_DURATION, times: [...particle.opacityTimes], ease: 'linear' },
              x: particle.moveTimes ? { duration: RESULT_DURATION, times: [...particle.moveTimes], ease: 'linear' } : undefined,
              y: particle.moveTimes ? { duration: RESULT_DURATION, times: [...particle.moveTimes], ease: 'linear' } : undefined,
              scale: particle.scaleTimes ? { duration: RESULT_DURATION, times: [...particle.scaleTimes], ease: 'easeOut' } : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

function ResultPopup({
  onClose,
  onRevealComplete,
  reduceMotion,
}: {
  onClose: () => void;
  onRevealComplete: () => void;
  reduceMotion: boolean;
}) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(9);
  const hasSelected = selectedCard !== null;

  useEffect(() => {
    if (hasSelected || reduceMotion) return;
    const timer = window.setInterval(() => {
      setCarouselIndex((current) => (current + 1) % resultCards.length);
    }, 1050);
    return () => window.clearInterval(timer);
  }, [hasSelected, reduceMotion]);

  useEffect(() => {
    if (!hasSelected) return;
    const timer = window.setTimeout(onRevealComplete, reduceMotion ? 500 : RESULT_DURATION * 1000);
    return () => window.clearTimeout(timer);
  }, [hasSelected, onRevealComplete, reduceMotion]);

  return (
    <>
      <motion.div
        className="popup-scrim"
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={hasSelected ? (reduceMotion ? { opacity: 0 } : { opacity: [1, 1, 0, 0] }) : { opacity: 1 }}
        transition={hasSelected && !reduceMotion ? resultFadeTransition : { duration: 0 }}
      />
      <motion.section
        className="fortune-popup result-popup"
        data-node-id="5:3049"
        role="dialog"
        aria-modal="true"
        aria-label="抽取今日灵感卡"
        initial={{ opacity: 1 }}
        animate={hasSelected ? (reduceMotion ? { opacity: 0 } : { opacity: [1, 1, 0, 0] }) : { opacity: 1 }}
        transition={hasSelected && !reduceMotion ? resultFadeTransition : { duration: 0 }}
      >
        <img className="popup-gradient" src={ASSETS.popupGradient} alt="" />
        <div className="popup-heading" data-node-id="5:3054">
          <img className="popup-cards" src={ASSETS.popupCards} alt="" aria-hidden="true" />
          <img className="popup-title" src={ASSETS.resultTitle} alt="今日灵感卡" />
        </div>

        <button className="popup-close result-close" type="button" onClick={onClose} aria-label="关闭弹窗">
          <img src={ASSETS.popupClose} alt="" />
        </button>

        <h2 className="result-prompt">凭直觉就好</h2>
        <img className="result-stroke" src={ASSETS.resultStroke} alt="" aria-hidden="true" />

        <div className={`result-carousel${hasSelected ? ' result-carousel-selected' : ''}`} data-node-id="32:453">
          <motion.div
            className="result-card-track"
            initial={{ opacity: 1 }}
            animate={hasSelected ? (reduceMotion ? { opacity: 0 } : { opacity: [1, 1, 0, 0] }) : { opacity: 1 }}
            transition={hasSelected && !reduceMotion ? {
              opacity: { duration: RESULT_DURATION, times: [0, .1455, .2364, 1], ease: ['linear', 'easeOut', 'linear'] },
            } : { duration: 0 }}
            drag={reduceMotion || hasSelected ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={.16}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) < 24) return;
              setCarouselIndex((current) =>
                (current + (info.offset.x < 0 ? 1 : -1) + resultCards.length) % resultCards.length
              );
            }}
          >
            <div className="result-auto-scroll">
              {resultCards.map((cardIndex) => {
                const cardId = `fortune-card-${cardIndex}`;
                let offset = cardIndex - carouselIndex;
                if (offset > resultCards.length / 2) offset -= resultCards.length;
                if (offset < -resultCards.length / 2) offset += resultCards.length;
                const distance = Math.abs(offset);
                const direction = Math.sign(offset);
                const x = direction * (distance === 0 ? 0 : 57 + (distance - 1) * 38);
                const scales = [1.25, 1.05, .92, .83, .76, .7];
                const opacities = [1, .96, .88, .76, .58, 0];
                return (
                  <motion.button
                    className="result-card-slot"
                    type="button"
                    key={cardId}
                    animate={{
                      x,
                      y: Math.min(distance, 5) * 4.2,
                      scale: scales[Math.min(distance, 5)],
                      rotateY: direction * -Math.min(distance * 3.5, 12),
                      opacity: opacities[Math.min(distance, 5)],
                    }}
                    transition={{ duration: .58, ease: [.22, 1, .36, 1] }}
                    style={{
                      zIndex: 30 - distance,
                      pointerEvents: distance > 4 ? 'none' : 'auto',
                    }}
                    aria-label={`选择第 ${cardIndex + 1} 张灵感卡`}
                    aria-current={distance === 0 ? 'true' : undefined}
                    disabled={hasSelected}
                    onClick={() => setSelectedCard(cardId)}
                  >
                    <img src={ASSETS.resultCard} alt="" draggable={false} />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        <p className="result-caption">翻开今天的关键词</p>
      </motion.section>

      {hasSelected && <div className="result-effect-stage" data-node-id="5:3020" aria-hidden="true">
        <motion.div
          className="result-dark-bg"
          initial={{ opacity: reduceMotion ? 1 : 0 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: [0, 0, 1, 1, .6] }}
          transition={reduceMotion ? { duration: 0 } : { opacity: { duration: RESULT_DURATION, times: [0, .1818, .3273, .9999, 1], ease: ['linear', 'easeOut', 'linear', 'easeOut'] } }}
        />
        <motion.img
          className="result-top-light"
          src={ASSETS.resultTopLight}
          alt=""
          initial={{ opacity: reduceMotion ? .9 : 0 }}
          animate={reduceMotion ? { opacity: .9 } : { opacity: [0, 0, .9, 1, .4] }}
          transition={reduceMotion ? { duration: 0 } : { opacity: { duration: RESULT_DURATION, times: [0, .46, .52, .72, 1], ease: ['linear', 'easeOut', 'easeInOut', 'easeOut'] } }}
        />
        <motion.img
          className="result-halo"
          src={ASSETS.resultCardHalo}
          alt=""
          initial={{ opacity: reduceMotion ? .8 : 0, scale: reduceMotion ? 1 : .5 }}
          animate={reduceMotion ? { opacity: .8, scale: 1 } : { opacity: [0, 0, .82, 1, .72, .5], scale: [.5, .5, 1, 1.1, 1] }}
          transition={reduceMotion ? { duration: 0 } : {
            opacity: { duration: RESULT_DURATION, times: [0, .46, .53, .68, .86, 1], ease: ['linear', 'easeOut', 'easeInOut', 'easeOut', 'linear'] },
            scale: { duration: RESULT_DURATION, times: [0, .46, .53, .72, 1], ease: ['linear', 'easeOut', 'easeInOut', 'easeOut'] },
          }}
        />
        <motion.div
          className="result-breakout-card"
          data-node-id="32:628"
          initial={{ opacity: 0, scaleX: .72, scaleY: .72, rotateY: 0 }}
          animate={reduceMotion ? { opacity: 0 } : {
            opacity: [0, 1, 1, 0, 0],
            scaleX: [.72, 1.4, 1.4, 1.4],
            scaleY: [.72, 1.4, 1.4, 1.4],
            rotateY: [0, 0, 88, 88],
          }}
          transition={reduceMotion ? { duration: 0 } : {
            opacity: { duration: RESULT_DURATION, times: [0, .03, .42, .48, 1], ease: ['easeOut', 'linear', 'easeOut', 'linear'] },
            scaleX: { duration: RESULT_DURATION, times: [0, .14, .42, 1], ease: [[0.16, 1, .3, 1], 'linear', 'linear'] },
            scaleY: { duration: RESULT_DURATION, times: [0, .14, .42, 1], ease: [[0.16, 1, .3, 1], 'linear', 'linear'] },
            rotateY: { duration: RESULT_DURATION, times: [0, .25, .36, 1], ease: ['linear', 'easeInOut', 'linear'] },
          }}
        >
          <img src={ASSETS.resultCard} alt="" />
        </motion.div>

        <motion.div
          className="result-front-reveal"
          data-node-id="188:373"
          initial={{
            height: 222.822,
            opacity: reduceMotion ? 1 : 0,
            scaleX: 1.4,
            scaleY: 1.4,
            rotateY: reduceMotion ? 0 : -88,
            boxShadow: '0 0 0 rgba(255,229,102,0)',
          }}
          animate={reduceMotion ? {
            height: 222.822,
            opacity: 1,
            scaleX: 1.4,
            scaleY: 1.4,
            rotateY: 0,
            boxShadow: '0 0 30px 7px rgba(255,213,70,.26)',
          } : {
            height: 222.822,
            opacity: [0, 0, 1, 1],
            scaleX: 1.4,
            scaleY: 1.4,
            rotateY: [-88, -88, 0, 0],
            boxShadow: [
              '0 0 0 rgba(255,229,102,0)',
              '0 0 0 rgba(255,229,102,0)',
              '0 0 44px 12px rgba(255,219,87,.42)',
              '0 0 32px 8px rgba(255,213,70,.28)',
              '0 0 24px 6px rgba(255,210,66,.18)',
            ],
          }}
          transition={reduceMotion ? { duration: 0 } : {
            opacity: { duration: RESULT_DURATION, times: [0, .339, .34, 1], ease: ['linear', 'easeOut', 'linear'] },
            rotateY: { duration: RESULT_DURATION, times: [0, .34, .44, 1], ease: ['linear', 'easeInOut', 'linear'] },
            boxShadow: { duration: RESULT_DURATION, times: [0, .46, .6, .82, 1], ease: 'linear' },
          }}
        >
          <motion.div
            className="result-front-image-wrap"
            initial={{ clipPath: reduceMotion ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }}
            animate={{ clipPath: reduceMotion ? 'inset(0 0 0% 0)' : ['inset(0 0 100% 0)', 'inset(0 0 100% 0)', 'inset(0 0 0% 0)', 'inset(0 0 0% 0)'] }}
            transition={reduceMotion ? { duration: 0 } : {
              clipPath: { duration: RESULT_DURATION, times: [0, .46, .74, 1], ease: ['linear', [.2, 0, .3, 1], 'linear'] },
            }}
          >
            <img src={ASSETS.resultCardFront} alt="" />
          </motion.div>
        </motion.div>

        <ResultParticles reduceMotion={reduceMotion} />

        <div className="result-light-sweep-angle">
          <motion.div
            className="result-light-sweep"
            data-node-id="188:363"
            initial={{ opacity: 0, y: 0 }}
            animate={reduceMotion ? { opacity: 0 } : { opacity: [0, 0, .9, .82, 0, 0], y: [0, 0, 343, 343] }}
            transition={reduceMotion ? { duration: 0 } : {
              opacity: { duration: RESULT_DURATION, times: [0, .46, .47, .71, .76, 1], ease: ['linear', 'easeOut', [0.5, 0, 0.5, 1], 'easeOut', 'linear'] },
              y: { duration: RESULT_DURATION, times: [0, .46, .74, 1], ease: ['linear', [.2, 0, .3, 1], 'linear'] },
            }}
          />
        </div>
      </div>}

      {hasSelected && <button className="result-stage-close" type="button" onClick={onClose} aria-label="关闭动画" />}
    </>
  );
}

function ResultDetail({
  onBack,
  onShare,
  question,
}: {
  onBack: () => void;
  onShare: () => void;
  question: string;
}) {
  const displayQuestion = question.replace(/^例如：/, '').replace(/[？?]$/, '') || '我今天的运气怎么样';
  const [questionVisible, setQuestionVisible] = useState(false);

  return (
    <motion.section
      className="detail-page"
      data-node-id="5:3080"
      initial={{ opacity: 0, scale: .985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: .36, ease: [0.16, 1, .3, 1] }}
      aria-label="宝剑骑士解读结果"
    >
      <img className="detail-light-texture" src={ASSETS.detailLight} alt="" />
      <img className="detail-light-overlay" src={ASSETS.detailLightOverlay} alt="" aria-hidden="true" />

      <div
        className="detail-scroll-area"
        onScroll={(event) => setQuestionVisible(event.currentTarget.scrollTop > 18)}
      >
        <div className="detail-scroll-content">
          <div className="detail-side-card detail-side-card-left" aria-hidden="true" />
          <div className="detail-side-card detail-side-card-right" aria-hidden="true" />

          <div className="detail-card-frame">
            <img src={ASSETS.resultCardFront} alt="宝剑骑士塔罗牌" />
          </div>

          <div className="detail-card-name">
            <strong>宝剑骑士</strong>
            <span className="detail-position">
              <img src={ASSETS.detailBadge} alt="" />
              <em>正位</em>
            </span>
          </div>

          <div className="detail-reading">
            <img className="detail-ornate-frame" src={ASSETS.detailFrame} alt="" />
            <img className="detail-section-crown" src={ASSETS.detailCrown} alt="" />
            <div className="detail-reading-content">
              <h2>✦ 欧欧解读 ✦</h2>
              <p>宝剑骑士象征行动、速度、信息与突破。骑士手持宝剑向前冲刺，代表一个充满想法、敢于行动的人，也代表新的消息、交流或机会正在快速到来。</p>
              <p>这意味着近期你可能会遇到一位推动你前进的人。这个“贵人”可能不是直接给予资源的人，而是通过一次交流、一条信息或一次合作，为你打开新的方向</p>
              <h2>✦ 欧欧建议 ✦</h2>
              <p className="detail-advice">-主动联系一个想认识的人<br />-多参与交流和合作<br />-把自己的想法表达出来</p>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-status" aria-hidden="true">
        <strong>9:41</strong>
        <span className="detail-signal">▮▮▮</span>
        <span className="detail-wifi">⌁</span>
        <span className="detail-battery" />
      </div>

      <button className="detail-back" type="button" onClick={onBack} aria-label="返回首页">‹</button>
      <a
        className="detail-download"
        href={ASSETS.resultCardFront}
        download="今日灵感卡-宝剑骑士.png"
        aria-label="下载宝剑骑士卡片"
      >
        <img src={ASSETS.detailDownload} alt="" />
      </a>
      <h1 className={`detail-question${questionVisible ? ' detail-question-visible' : ''}`}>
        “{displayQuestion}”
      </h1>

      <div className="detail-actions">
        <div className="detail-suggestions">
          <span className="detail-mini-card"><img src={ASSETS.resultCardFront} alt="" />宝剑骑士卡</span>
          <button type="button">⌕&nbsp; 深度解读</button>
          <button type="button">⌕&nbsp; 贵人信号</button>
          <button type="button">⌕&nbsp; 情感建议</button>
        </div>
        <div className="detail-main-actions">
          <button type="button">应用该状态</button>
          <button type="button" onClick={onShare}>生成分享图</button>
        </div>
        <span className="detail-home-indicator" aria-hidden="true" />
      </div>
    </motion.section>
  );
}

function SharePoster({ onBack }: { onBack: () => void }) {
  const [screenReady, setScreenReady] = useState(false);
  const reduceMotion = useReducedMotion();

  const shareWithFriends = async () => {
    const shareData = {
      title: '今日灵感卡·宝剑骑士',
      text: '我的今日灵感卡是宝剑骑士',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    await navigator.clipboard?.writeText(window.location.href);
  };

  return (
    <motion.section
      className="share-page"
      data-node-id="5:3171"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: .28, ease: 'easeOut' }}
      aria-label="今日灵感卡分享图"
    >
      <button className="share-backdrop" type="button" onClick={onBack} aria-label="返回解读结果" />
      <img className="share-screen share-screen-preview" src={ASSETS.shareScreenPreview} alt="" />
      <img
        className={`share-screen share-screen-hd${screenReady ? ' share-screen-hd-ready' : ''}`}
        src={ASSETS.shareScreen}
        alt="今日抽卡·宝剑骑士分享图"
        onLoad={() => setScreenReady(true)}
      />
      <button className="share-close" type="button" onClick={onBack} aria-label="关闭分享图" />
      <a
        className="share-hit share-save-hit"
        href={ASSETS.shareCardHd}
        download="今日灵感卡-宝剑骑士.png"
        aria-label="保存图片"
      />
      <motion.button
        className="share-hit share-send-hit"
        data-node-id="5:3543"
        type="button"
        onClick={shareWithFriends}
        aria-label="分享好友"
        initial={{ scaleX: 1, scaleY: 1 }}
        animate={reduceMotion ? undefined : {
          scaleX: [1, 1.08, 1, 1.08, 1, 1.08, 1, 1.08, 1, 1.08, 1, 1],
          scaleY: [1, 1.08, 1, 1.08, 1, 1.08, 1, 1.08, 1, 1.08, 1, 1],
        }}
        transition={reduceMotion ? undefined : sharePulseTransition}
      />
    </motion.section>
  );
}

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupView, setPopupView] = useState<'question' | 'result' | 'detail' | 'share'>('question');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [question, setQuestion] = useState<string>(questionSuggestions[0]);

  useEffect(() => {
    [ASSETS.shareScreenPreview, ASSETS.shareScreen].forEach((src) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
      void image.decode().catch(() => undefined);
    });
  }, []);

  return (
    <main className="page-shell">
      <section className="home-canvas" aria-label="迅雷浏览器首页动效">
        <div className="background-art" aria-hidden="true">
          <div className="background-base" />
          <img className="background-texture" src={ASSETS.background} alt="" />

          <div className="ellipse-top-wrap">
            <img className="ellipse-top" src={ASSETS.ellipseTop} alt="" />
          </div>

          <div className="ellipse-bottom-wrap">
            <img className="ellipse-bottom" src={ASSETS.ellipseBottom} alt="" />
          </div>
        </div>

        <div className="brand-logo" data-node-id="5:2587">
          <img src={ASSETS.logo} alt="迅雷" />
        </div>

        <label className="search-box" data-node-id="5:2589">
          <input aria-label="搜索或输入网址" placeholder="搜索或输入网址" />
          <img src={ASSETS.scan} alt="扫描" />
        </label>

        <nav className="shortcut-row" aria-label="快捷入口">
          {shortcuts.map((item) => (
            <button className="shortcut" type="button" key={item.icon}>
              <img src={item.icon} alt="" />
              <span aria-hidden={!item.label}>{item.label || '\u200b'}</span>
            </button>
          ))}
        </nav>

        <div className="mascot" data-node-id="5:2600" aria-hidden="true">
          <img className="mascot-art" src={ASSETS.cardArt} alt="" />
          <motion.div
            className="flying-card"
            data-node-id="5:2602"
            initial={
              reduceMotion
                ? { opacity: 1, scaleX: 1, scaleY: 1, x: 0, y: -4 }
                : { opacity: 0, scaleX: 10, scaleY: 1, x: 200, y: -196 }
            }
            animate={{
              opacity: [0, 0, 1, 1],
              scaleX: [10, 10, 1.2, 1, 1],
              scaleY: [1, 1, 0.8, 1, 1],
              x: [200, 200, 0, 0],
              y: [-196, -196, 4, 0, -4, -4],
            }}
            transition={reduceMotion ? { duration: 0 } : objectTransition}
          >
            <img src={ASSETS.object} alt="" />
          </motion.div>
        </div>

        <motion.div
          className="magic-title"
          data-node-id="5:2603"
          initial={
            reduceMotion
              ? { opacity: 1, scaleX: 1, scaleY: 1, y: -4 }
              : { opacity: 0, scaleX: 1, scaleY: 1, y: -116 }
          }
          animate={{
            opacity: [0, 0, 1, 1],
            scaleX: [1, 1, 1.2, 0.993, 1, 1],
            scaleY: [1, 1, 0.8, 1.007, 1, 1],
            y: [-116, -116, 4, 0, -4.143, -3.995, -4],
          }}
          transition={reduceMotion ? { duration: 0 } : magicTransition}
          aria-hidden="true"
        >
          <img src={ASSETS.magic} alt="" />
        </motion.div>

        <button
          className="fortune-trigger"
          type="button"
          aria-label="打开今日灵感卡"
          aria-haspopup="dialog"
          onClick={() => {
            setPopupView('question');
            setPopupOpen(true);
          }}
        />

        {popupOpen && popupView === 'question' && (
          <FortunePopup
            onClose={() => setPopupOpen(false)}
            onDraw={() => setPopupView('result')}
            reduceMotion={Boolean(reduceMotion)}
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
            question={question}
            onQuestionChange={setQuestion}
          />
        )}
        {popupOpen && popupView === 'result' && (
          <ResultPopup
            onClose={() => setPopupOpen(false)}
            onRevealComplete={() => setPopupView('detail')}
            reduceMotion={Boolean(reduceMotion)}
          />
        )}
        {popupOpen && popupView === 'detail' && (
          <ResultDetail
            onShare={() => setPopupView('share')}
            question={question}
            onBack={() => {
              setPopupOpen(false);
              setPopupView('question');
            }}
          />
        )}
        {popupOpen && popupView === 'share' && (
          <SharePoster onBack={() => setPopupView('detail')} />
        )}
      </section>
    </main>
  );
}
