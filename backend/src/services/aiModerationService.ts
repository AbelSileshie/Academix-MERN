import { GoogleGenerativeAI } from '@google/generative-ai';

interface ContentAnalysisResult {
  toxicityScore: number;
  categories: string[];
  recommendation: 'approve' | 'warn' | 'remove' | 'ban';
  confidence: number;
  flaggedContent: string[];
  reasoning: string;
}

class AIContentModerationService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required for content moderation');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzeContent(content: string, context?: {
    authorRole?: string;
    reportCount?: number;
    previousWarnings?: number;
  }): Promise<ContentAnalysisResult> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
        Analyze the following content for inappropriate material and provide a moderation recommendation.
        
        Content to analyze: "${content}"
        
        ${context ? `
        Additional context:
        - Author role: ${context.authorRole || 'student'}
        - Number of reports: ${context.reportCount || 0}
        - Previous warnings: ${context.previousWarnings || 0}
        ` : ''}
        
        Please analyze this content and respond with a JSON object containing:
        {
          "toxicityScore": (number between 0-1, where 1 is most toxic),
          "categories": (array of applicable categories: ["harassment", "hate_speech", "spam", "misinformation", "inappropriate", "privacy_violation", "threats", "adult_content"]),
          "recommendation": ("approve", "warn", "remove", or "ban"),
          "confidence": (number between 0-1 indicating confidence in assessment),
          "flaggedContent": (array of specific phrases or words that triggered flags),
          "reasoning": (brief explanation of the decision)
        }
        
        Guidelines:
        - "approve": Content is acceptable
        - "warn": Content is borderline, send warning to user
        - "remove": Content should be removed but user can stay
        - "ban": Content is severely inappropriate, consider account suspension
        
        Consider context like academic discussions, constructive criticism, and educational content as acceptable.
        Be strict about harassment, hate speech, threats, and privacy violations.
        
        Respond only with valid JSON.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      try {
        const analysis = JSON.parse(text);
        
        // Validate the response structure
        if (!this.isValidAnalysisResult(analysis)) {
          throw new Error('Invalid response structure from AI');
        }

        return analysis;
      } catch (parseError) {
        console.error('Failed to parse AI response:', text);
        // Return a safe fallback
        return {
          toxicityScore: 0.5,
          categories: ['unknown'],
          recommendation: 'warn',
          confidence: 0.3,
          flaggedContent: [],
          reasoning: 'AI analysis failed, manual review required'
        };
      }
    } catch (error) {
      console.error('AI content analysis error:', error);
      // Return a safe fallback for manual review
      return {
        toxicityScore: 0.5,
        categories: ['analysis_error'],
        recommendation: 'warn',
        confidence: 0.1,
        flaggedContent: [],
        reasoning: 'AI service unavailable, manual review required'
      };
    }
  }

  private isValidAnalysisResult(obj: any): obj is ContentAnalysisResult {
    return (
      typeof obj === 'object' &&
      typeof obj.toxicityScore === 'number' &&
      Array.isArray(obj.categories) &&
      ['approve', 'warn', 'remove', 'ban'].includes(obj.recommendation) &&
      typeof obj.confidence === 'number' &&
      Array.isArray(obj.flaggedContent) &&
      typeof obj.reasoning === 'string'
    );
  }

  async analyzePostForReports(postContent: string, reportReasons: string[], reportCount: number): Promise<ContentAnalysisResult> {
    const combinedContent = `
      Post Content: ${postContent}
      
      User Reports (${reportCount} total):
      ${reportReasons.map((reason, index) => `${index + 1}. ${reason}`).join('\n')}
    `;

    return this.analyzeContent(combinedContent, {
      reportCount,
      authorRole: 'student'
    });
  }

  getAutomaticAction(analysis: ContentAnalysisResult, userWarningCount: number): {
    action: 'none' | 'warn' | 'remove_post' | 'ban_user';
    duration?: 'temporary' | 'permanent';
    banDays?: number;
  } {
    const { recommendation, toxicityScore, confidence } = analysis;

    // High confidence decisions
    if (confidence > 0.8) {
      switch (recommendation) {
        case 'approve':
          return { action: 'none' };
        case 'warn':
          return { action: 'warn' };
        case 'remove':
          return { action: 'remove_post' };
        case 'ban':
          if (toxicityScore > 0.9) {
            return { action: 'ban_user', duration: 'permanent' };
          }
          return { action: 'ban_user', duration: 'temporary', banDays: 7 };
      }
    }

    // Consider user history for borderline cases
    if (userWarningCount >= 3 && recommendation !== 'approve') {
      return { action: 'ban_user', duration: 'temporary', banDays: 3 };
    }

    if (userWarningCount >= 2 && ['remove', 'ban'].includes(recommendation)) {
      return { action: 'remove_post' };
    }

    // Default actions for lower confidence
    switch (recommendation) {
      case 'ban':
        return { action: 'remove_post' }; // Downgrade to removal for low confidence
      case 'remove':
        return { action: 'warn' }; // Downgrade to warning for low confidence
      default:
        return { action: 'none' };
    }
  }
}

export default new AIContentModerationService();
