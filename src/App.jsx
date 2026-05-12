import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const questions = [
  ["聚会结束后你通常会？", "越玩越有精神", "想赶紧回家安静一下", "E", "I"],
  ["遇到问题时你更倾向？", "先说出来边聊边想", "自己先思考清楚", "E", "I"],
  ["你更喜欢？", "热闹、人多的环境", "安静、独处的环境", "E", "I"],
  ["认识新朋友时？", "主动开启话题", "等别人先开口", "E", "I"],
  ["周末理想状态是？", "出门社交活动", "在家放松充电", "E", "I"],
  ["工作时你更喜欢？", "团队协作", "独立完成", "E", "I"],
  ["别人通常觉得你？", "外向健谈", "慢热安静", "E", "I"],

  ["你更关注？", "现实细节", "未来可能性", "S", "N"],
  ["学习新东西时你更喜欢？", "实际案例", "理论和概念", "S", "N"],
  ["你更容易相信？", "经验事实", "灵感直觉", "S", "N"],
  ["你更擅长？", "落地执行", "创意构想", "S", "N"],
  ["聊天时你更喜欢？", "真实经历", "抽象话题", "S", "N"],
  ["做事时你更倾向？", "按步骤来", "边做边改", "S", "N"],
  ["你觉得自己？", "务实", "有想象力", "S", "N"],

  ["做决定时你更看重？", "逻辑正确", "人的感受", "T", "F"],
  ["朋友做错事时你会？", "直接指出问题", "先照顾情绪", "T", "F"],
  ["你更希望别人评价你？", "聪明理性", "温暖善良", "T", "F"],
  ["争论时你更关注？", "谁更有道理", "气氛是否和谐", "T", "F"],
  ["你更容易？", "讲道理", "共情别人", "T", "F"],
  ["面对规则时你？", "规则优先", "视情况而定", "T", "F"],
  ["你认为自己更偏？", "冷静客观", "情绪敏感", "T", "F"],

  ["旅行前你通常？", "提前规划好", "随走随看", "J", "P"],
  ["工作时你更喜欢？", "明确安排", "灵活自由", "J", "P"],
  ["你更倾向？", "提前完成任务", "最后时刻冲刺", "J", "P"],
  ["房间/桌面通常？", "整洁有序", "比较随意", "J", "P"],
  ["计划被打乱时你会？", "很烦躁", "觉得无所谓", "J", "P"],
  ["你更喜欢的状态？", "可控稳定", "新鲜变化", "J", "P"],
  ["别人通常觉得你？", "自律靠谱", "自由随性", "J", "P"],
];

const typeNames = {
  INTJ: "建筑师",
  INTP: "逻辑学家",
  ENTJ: "指挥官",
  ENTP: "辩论家",
  INFJ: "提倡者",
  INFP: "调停者",
  ENFJ: "主人公",
  ENFP: "竞选者",
  ISTJ: "物流师",
  ISFJ: "守卫者",
  ESTJ: "总经理",
  ESFJ: "执政官",
  ISTP: "鉴赏家",
  ISFP: "探险家",
  ESTP: "企业家",
  ESFP: "表演者",
};

const reports = {
  INTJ: {
    summary: "你是目标感很强的长期主义者，重视逻辑、效率和独立空间。",
    personality:
      "INTJ通常喜欢先理解一件事的底层逻辑，再决定是否投入行动。你对混乱、低效、重复沟通比较敏感，更喜欢清晰的目标、明确的计划和可被验证的结果。你的优势不在于短期热闹，而在于长期布局。",
    strengths: ["战略思维强", "独立判断力强", "适合做长期项目", "学习能力强", "抗干扰能力强"],
    weakness: ["容易显得冷淡", "对他人要求较高", "不擅长表达情绪", "容易过度追求完美"],
    career: ["产品经理", "策略顾问", "创业者", "数据分析", "技术开发", "投资研究"],
    money: "适合做高客单咨询、知识产品、AI工具应用、系统化课程、长期品牌项目。",
    love: "感情中慢热但认真，重视成熟、稳定和边界感，不喜欢高消耗关系。",
    social: "社交中更看重质量而不是数量，不喜欢无效寒暄。",
    growth: "学会适度表达情绪，会让你的合作和亲密关系更加轻松。",
    aiComment: "你的人格非常适合AI时代的长期竞争环境，适合做系统化、策略型项目。",
  },

  INTP: {
    summary: "你是典型的思考型人格，喜欢研究本质、逻辑和系统。",
    personality:
      "INTP善于拆解复杂问题，喜欢追问为什么。你不喜欢被流程束缚，但非常适合做需要深度分析、模型搭建和创意推理的事情。",
    strengths: ["逻辑推理强", "学习速度快", "好奇心强", "能看见问题本质", "思想开放"],
    weakness: ["执行容易拖延", "不喜欢繁琐细节", "容易沉迷思考", "情绪表达较弱"],
    career: ["技术开发", "研究员", "产品架构", "数据分析", "AI应用", "知识博主"],
    money: "适合用认知和技术赚钱，例如AI工具、知识库、课程、分析报告、自动化系统。",
    love: "感情中需要精神交流和自由空间，不喜欢被过度控制。",
    social: "偏向小圈层深度社交，对泛泛社交兴趣不高。",
    growth: "提升执行力，会让你的能力真正落地并变成结果。",
    aiComment: "你属于非常适合未来科技行业的人格类型。",
  },

  ENTJ: {
    summary: "你是目标导向的组织者，天生关注效率、资源和结果。",
    personality:
      "ENTJ喜欢掌控方向，擅长把混乱的事情变成计划，把松散的人组织成团队。你对机会敏感，也愿意承担责任。",
    strengths: ["领导力强", "目标感强", "决策果断", "资源整合能力强", "抗压能力强"],
    weakness: ["容易强势", "耐心不足", "忽视他人感受", "容易工作过载"],
    career: ["企业管理", "创业者", "销售负责人", "项目负责人", "战略咨询", "投资"],
    money: "适合做规模化生意、高客单服务、团队型项目、管理咨询和资源整合型项目。",
    love: "感情中希望关系清晰、稳定、共同成长。需要注意不要把管理模式带入亲密关系。",
    social: "人际关系通常带有目标感，擅长结识有价值的人。",
    growth: "学会共情和授权，会让你的领导力更持久。",
    aiComment: "你具备极强的商业人格特征，适合做管理者或创业者。",
  },

  ENTP: {
    summary: "你是创意和机会型人格，思维活跃、反应快，擅长突破规则。",
    personality:
      "ENTP喜欢变化、讨论和挑战观点。你适合从0到1，适合做新项目、新内容、新商业模式，但需要补足持续执行。",
    strengths: ["创意强", "口才好", "反应快", "适应力强", "机会嗅觉敏锐"],
    weakness: ["容易不稳定", "执行后劲不足", "讨厌重复工作", "容易分心"],
    career: ["创业", "营销策划", "短视频", "商业顾问", "销售", "产品创新"],
    money: "适合做内容流量、创意产品、咨询、课程、社群、AI玩法和电商项目。",
    love: "感情中需要新鲜感和精神碰撞，不喜欢沉闷关系。",
    social: "很容易打开社交局面，适合做连接者和话题中心。",
    growth: "持续力比灵感更重要，建议建立复盘机制和执行节奏。",
    aiComment: "你的人格非常适合互联网和AI时代的新机会。",
  },  INFJ: {
    summary: "你是理想主义与洞察力并存的人格，擅长理解人性。",
    personality:
      "INFJ通常内心敏感而深刻，你能够察觉别人看不到的情绪和变化。你重视意义感，希望做真正有价值的事情。",
    strengths: ["洞察力强", "共情能力高", "责任感强", "思维深度强", "理想主义"],
    weakness: ["容易内耗", "过度敏感", "情绪压抑", "理想化倾向"],
    career: ["心理咨询", "教育", "内容创作", "品牌策划", "公益行业"],
    money: "适合通过长期价值输出、IP、咨询、教育型项目赚钱。",
    love: "追求灵魂伴侣型关系，希望彼此理解和成长。",
    social: "外冷内热，不喜欢浅层社交。",
    growth: "降低对完美关系和完美人生的期待，会更轻松。",
    aiComment: "你的人格具备很强的长期影响力。",
  },

  INFP: {
    summary: "你是理想感和创造力很强的人格。",
    personality:
      "INFP重视真实、自我表达和情绪价值。你适合创造型工作，不喜欢被高度约束。",
    strengths: ["创造力强", "审美能力强", "共情能力高", "想象力丰富", "价值感明确"],
    weakness: ["执行不稳定", "容易逃避现实", "容易情绪化", "容易拖延"],
    career: ["设计", "写作", "音乐", "插画", "内容创作", "个人IP"],
    money: "适合通过创意、审美、个人IP和内容变现。",
    love: "重视情绪连接和精神共鸣。",
    social: "更喜欢舒服自然的小圈子。",
    growth: "需要提升现实行动力和持续执行能力。",
    aiComment: "你具备非常强的艺术人格和创作潜力。",
  },

  ENFJ: {
    summary: "你是天生的鼓舞者和领导者。",
    personality:
      "ENFJ擅长调动气氛、影响别人，也很重视团队关系和集体成长。",
    strengths: ["感染力强", "组织能力强", "共情能力强", "沟通能力优秀", "责任感强"],
    weakness: ["容易过度付出", "在意别人评价", "情绪消耗大", "压力感强"],
    career: ["教育培训", "社群运营", "团队管理", "咨询", "IP打造"],
    money: "适合通过影响力、团队和社群赚钱。",
    love: "希望建立长期稳定、有成长性的关系。",
    social: "社交能力极强，很容易成为团队核心。",
    growth: "别总承担所有人的情绪。",
    aiComment: "你的人格非常适合做影响力型事业。",
  },

  ENFP: {
    summary: "你充满热情、想象力和表达欲。",
    personality:
      "ENFP很容易被新鲜事物点燃，对世界充满兴趣。你适合内容、表达、创意和变化型行业。",
    strengths: ["表达力强", "感染力强", "创意丰富", "适应力强", "乐观"],
    weakness: ["容易三分钟热度", "执行不稳定", "容易分心", "缺少长期规划"],
    career: ["短视频", "直播", "内容创作", "社群", "品牌策划"],
    money: "适合通过流量、IP、社群、内容和创意赚钱。",
    love: "需要情绪回应和持续新鲜感。",
    social: "很容易成为气氛担当。",
    growth: "持续行动比灵感更重要。",
    aiComment: "你非常适合内容时代和流量时代。",
  },

  ISTJ: {
    summary: "你是稳定、可靠、执行力很强的人格。",
    personality:
      "ISTJ重视规则、责任和稳定性，做事认真，适合长期积累型发展。",
    strengths: ["靠谱", "执行力强", "细节能力强", "责任感强", "稳定"],
    weakness: ["不够灵活", "保守", "不喜欢变化", "表达偏弱"],
    career: ["财务", "行政", "工程", "项目管理", "公务系统"],
    money: "适合长期稳定积累财富。",
    love: "感情中务实稳定。",
    social: "偏慢热型，不喜欢复杂社交。",
    growth: "适度接受变化，会让你更强。",
    aiComment: "你的人格非常适合长期主义。",
  },

  ISFJ: {
    summary: "你温和、负责且非常照顾别人。",
    personality:
      "ISFJ很重视安全感与关系稳定，习惯默默付出。",
    strengths: ["细心", "温柔", "责任感强", "耐心", "稳定"],
    weakness: ["容易压抑自己", "害怕冲突", "容易讨好别人", "过度付出"],
    career: ["教育", "护理", "客服", "行政", "人事"],
    money: "适合稳定型收入和长期服务行业。",
    love: "感情中愿意长期投入。",
    social: "重视长期关系。",
    growth: "学会优先照顾自己。",
    aiComment: "你的人格有很强的治愈感。",
  },

  ESTJ: {
    summary: "你是强执行、强管理型人格。",
    personality:
      "ESTJ喜欢秩序、规则和结果，不喜欢低效率。",
    strengths: ["执行力强", "组织能力强", "责任感强", "现实", "抗压"],
    weakness: ["容易强势", "不够柔软", "控制欲强", "耐心不足"],
    career: ["管理", "运营", "销售", "项目负责人", "商业管理"],
    money: "适合管理型和团队型赚钱模式。",
    love: "偏务实型关系。",
    social: "容易成为组织者。",
    growth: "学会倾听，会让你更成熟。",
    aiComment: "你的人格很适合管理岗位。",
  },

  ESFJ: {
    summary: "你是非常重视关系和氛围的人格。",
    personality:
      "ESFJ喜欢帮助别人，也希望获得群体认同。",
    strengths: ["亲和力强", "善于照顾人", "责任感强", "执行稳定", "合作能力强"],
    weakness: ["容易在意评价", "容易情绪化", "容易讨好别人", "害怕冲突"],
    career: ["服务行业", "教育", "人事", "客服", "社群运营"],
    money: "适合关系型和服务型赚钱模式。",
    love: "感情中很愿意长期投入。",
    social: "社交能力优秀。",
    growth: "别总把别人放在第一位。",
    aiComment: "你的人格具备很强的亲和感染力。",
  },

  ISTP: {
    summary: "你冷静、理性、擅长解决现实问题。",
    personality:
      "ISTP喜欢自由和实操，对现实问题有很强解决能力。",
    strengths: ["动手能力强", "冷静", "逻辑强", "适应力强", "独立"],
    weakness: ["不喜欢被束缚", "表达偏弱", "缺少长期规划", "容易冷淡"],
    career: ["技术", "工程", "维修", "摄影", "程序开发"],
    money: "适合技能型赚钱模式。",
    love: "需要空间感和自由。",
    social: "社交偏低频。",
    growth: "提升长期规划能力。",
    aiComment: "你属于高实战型人格。",
  },  ISFP: {
    summary: "你温柔、有审美且重视自由。",
    personality:
      "ISFP不喜欢被强行改变，更喜欢真实自然的生活方式。",
    strengths: ["审美强", "温柔", "创造力强", "适应力强", "共情能力好"],
    weakness: ["容易逃避压力", "缺少规划", "容易情绪化", "不喜欢竞争"],
    career: ["设计", "摄影", "音乐", "美妆", "艺术创作"],
    money: "适合审美型和创意型行业。",
    love: "重视温柔和情绪价值。",
    social: "喜欢舒服自然的关系。",
    growth: "提升现实行动力。",
    aiComment: "你的人格很有艺术气质。",
  },

  ESTP: {
    summary: "你行动力强，喜欢刺激和挑战。",
    personality:
      "ESTP喜欢快速反馈和现实结果，不喜欢拖沓。",
    strengths: ["行动力强", "适应力强", "社交能力强", "胆量大", "现实感强"],
    weakness: ["缺少耐心", "容易冲动", "不喜欢长期规划", "容易冒险"],
    career: ["销售", "创业", "直播", "市场营销", "商业运营"],
    money: "适合流量、销售和快速反馈型项目。",
    love: "需要激情和新鲜感。",
    social: "社交中非常有存在感。",
    growth: "提升长期规划能力。",
    aiComment: "你的人格很适合互联网流量时代。",
  },

  ESFP: {
    summary: "你热情、外向且充满感染力。",
    personality:
      "ESFP喜欢快乐、热闹和即时反馈。",
    strengths: ["表达能力强", "感染力强", "乐观", "适应力强", "社交能力强"],
    weakness: ["容易分心", "缺少长期规划", "容易情绪化", "讨厌枯燥"],
    career: ["主播", "演员", "销售", "短视频", "娱乐行业"],
    money: "适合流量和曝光型赚钱模式。",
    love: "感情中热情直接。",
    social: "容易成为人群焦点。",
    growth: "提升专注力非常重要。",
    aiComment: "你的人格非常适合内容时代。",
  },
};

function calculateType(answers) {
  const counts = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  answers.forEach((a) => {
    counts[a]++;
  });

  return (
    (counts.E >= counts.I ? "E" : "I") +
    (counts.S >= counts.N ? "S" : "N") +
    (counts.T >= counts.F ? "T" : "F") +
    (counts.J >= counts.P ? "J" : "P")
  );
}

export default function MBTIWebsitePrototype() {
  const [page, setPage] = useState("home");
  const [inviteCode, setInviteCode] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [resultType, setResultType] = useState("");

  const currentQuestion = questions[current];

  const startTest = () => {
    if (inviteCode.trim().length < 6) {
      alert("请输入正确邀请码");
      return;
    }

    setPage("test");
  };

  const chooseAnswer = (value) => {
    const newAnswers = [...answers, value];

    setAnswers(newAnswers);

    if (current + 1 >= questions.length) {
      const type = calculateType(newAnswers);
      setResultType(type);
      setPage("result");
    } else {
      setCurrent(current + 1);
    }
  };

  const report = reports[resultType];

const downloadPDF = async () => {
  const input = document.getElementById("report");

  const canvas = await html2canvas(input, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#000000",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`${resultType}-人格报告.pdf`);
};

  return (
    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        color: "#fff",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      {page === "home" && (
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            textAlign: "center",
            paddingTop: "60px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#ff9900",
              color: "#000",
              padding: "8px 18px",
              borderRadius: "999px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            2026 AI人格分析系统
          </div>

          <h1
            style={{
              fontSize: "52px",
              color: "#ffb84d",
              marginBottom: "20px",
            }}
          >
            MBTI 深度人格测试
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#ccc",
              lineHeight: "1.8",
            }}
          >
            AI驱动的人格分析系统，深度解析你的性格优势、财富潜力、职业方向与关系模式。
          </p>

          <div
            style={{
              marginTop: "50px",
              background: "#111",
              border: "1px solid #333",
              borderRadius: "20px",
              padding: "40px",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
                color: "#ffb84d",
              }}
            >
              输入邀请码开始测试
            </h2>

            <input
              value={inviteCode}
              onChange={(e) =>
                setInviteCode(e.target.value)
              }
              placeholder="请输入邀请码，例如 MBTI-2026"
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: "12px",
                border: "1px solid #444",
                background: "#000",
                color: "#fff",
                fontSize: "16px",
                marginBottom: "20px",
              }}
            />

            <button
              onClick={startTest}
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: "12px",
                border: "none",
                background: "#ff9900",
                color: "#000",
                fontWeight: "bold",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              立即进入测试
            </button>
          </div>
        </div>
      )}
            {page === "test" && (
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            paddingTop: "60px",
          }}
        >
          <div
            style={{
              color: "#ff9900",
              marginBottom: "20px",
              fontSize: "18px",
            }}
          >
            第 {current + 1} / {questions.length} 题
          </div>

          <div
            style={{
              background: "#111",
              borderRadius: "20px",
              padding: "40px",
              border: "1px solid #333",
            }}
          >
            <h2
              style={{
                fontSize: "34px",
                marginBottom: "40px",
                lineHeight: "1.5",
              }}
            >
              {currentQuestion[0]}
            </h2>

            <button
              onClick={() =>
                chooseAnswer(currentQuestion[3])
              }
              style={{
                width: "100%",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "14px",
                border: "1px solid #333",
                background: "#000",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              A. {currentQuestion[1]}
            </button>

            <button
              onClick={() =>
                chooseAnswer(currentQuestion[4])
              }
              style={{
                width: "100%",
                padding: "20px",
                borderRadius: "14px",
                border: "1px solid #333",
                background: "#000",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              B. {currentQuestion[2]}
            </button>
          </div>
        </div>
      )}

      {page === "result" && (
        <div
          id="report"
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            paddingTop: "40px",
          }}
        >
          <div
            style={{
              background: "#111",
              borderRadius: "24px",
              padding: "50px",
              border: "1px solid #333",
            }}
          >
            <div
              style={{
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: "#ff9900",
                  color: "#000",
                  padding: "8px 20px",
                  borderRadius: "999px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                AI人格分析结果
              </div>

              <h1
                style={{
                  fontSize: "64px",
                  color: "#ffb84d",
                  marginBottom: "10px",
                }}
              >
                {resultType}
              </h1>

              <h2
                style={{
                  fontSize: "30px",
                  marginBottom: "30px",
                }}
              >
                {typeNames[resultType]}
              </h2>

              <p
                style={{
                  color: "#ccc",
                  fontSize: "20px",
                  lineHeight: "1.8",
                }}
              >
                {report.summary}
              </p>
            </div>

            <div
              style={{
                marginTop: "40px",
                display: "grid",
                gap: "20px",
              }}
            >
              {[
                ["核心性格分析", report.personality],
                ["财富分析", report.money],
                ["职业方向", report.career.join("、")],
                ["感情关系", report.love],
                ["社交模式", report.social],
                ["成长建议", report.growth],
                ["AI评价", report.aiComment],
              ].map(([title, content]) => (
                <div
                  key={title}
                  style={{
                    background: "#1a1a1a",
                    padding: "30px",
                    borderRadius: "18px",
                    border: "1px solid #333",
                  }}
                >
                  <h3
                    style={{
                      color: "#ffb84d",
                      marginBottom: "16px",
                      fontSize: "24px",
                    }}
                  >
                    {title}
                  </h3>

                  <p
                    style={{
                      color: "#ddd",
                      lineHeight: "1.9",
                      fontSize: "18px",
                    }}
                  >
                    {content}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "40px",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: "20px",
              }}
            >
              <div
                style={{
                  background: "#1a1a1a",
                  padding: "24px",
                  borderRadius: "18px",
                  border: "1px solid #333",
                }}
              >
                <h3
                  style={{
                    color: "#ffb84d",
                    marginBottom: "16px",
                  }}
                >
                  核心优势
                </h3>

                {report.strengths.map((s) => (
                  <div
                    key={s}
                    style={{
                      marginBottom: "10px",
                      color: "#ddd",
                    }}
                  >
                    • {s}
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "#1a1a1a",
                  padding: "24px",
                  borderRadius: "18px",
                  border: "1px solid #333",
                }}
              >
                <h3
                  style={{
                    color: "#ffb84d",
                    marginBottom: "16px",
                  }}
                >
                  潜在短板
                </h3>

                {report.weakness.map((s) => (
                  <div
                    key={s}
                    style={{
                      marginBottom: "10px",
                      color: "#ddd",
                    }}
                  >
                    • {s}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={downloadPDF}
              style={{
                width: "100%",
                marginTop: "40px",
                padding: "22px",
                borderRadius: "16px",
                border: "none",
                background: "#ff9900",
                color: "#000",
                fontWeight: "bold",
                fontSize: "22px",
                cursor: "pointer",
              }}
            >
              下载PDF人格报告
            </button>
          </div>
        </div>
      )}
    </div>
  );
}