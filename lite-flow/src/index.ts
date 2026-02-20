import 'dotenv/config';

interface Context {
  [key: string]: any;
}

type StepFunction = (context: Context) => Promise<any> | any;

class LiteFlow {
  private steps: { name: string; action: StepFunction }[] = [];
  private context: Context = {};

  addStep(name: string, action: StepFunction) {
    this.steps.push({ name, action });
    return this;
  }

  async run() {
    console.log('🚀 Starting Workflow...');
    for (const step of this.steps) {
      console.log(`📦 Running Step: ${step.name}...`);
      try {
        const result = await step.action(this.context);
        this.context[step.name] = result;
        console.log(`✅ Step ${step.name} completed successfully.`);
      } catch (error: any) {
        console.error(`❌ Error in Step ${step.name}: ${error.message}`);
        break;
      }
    }
    console.log('🏁 Workflow Finished.');
    return this.context;
  }
}

// Example usage
const flow = new LiteFlow();

flow
  .addStep('fetchData', async () => {
    // Simulate an API call
    return { user: 'Admin', status: 'Active' };
  })
  .addStep('processData', (ctx) => {
    return { ...ctx.fetchData, timestamp: new Date().toISOString() };
  })
  .addStep('finalLog', (ctx) => {
    console.log('Final Result:', JSON.stringify(ctx.processData, null, 2));
  });

flow.run();
