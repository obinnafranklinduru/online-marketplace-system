import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface ApiGatewayStackProps {
  productService: IFunction;
  categoryService: IFunction;
  dealsService: IFunction;
  imageService: IFunction;
  queueService: IFunction;
}

interface ResourceType {
  name: string;
  methods: string[];
  child?: ResourceType;
}

export class ApiGatewayStack extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id);
    this.addResource("product", props);
  }

  addResource(
    serviceName: string,
    {
      categoryService,
      productService,
      dealsService,
      imageService,
      queueService,
    }: ApiGatewayStackProps
  ) {
    const apgw = new RestApi(this, `${serviceName}-ApiGtw`);

    this.createEndpoints(productService, apgw, {
      name: "product",
      methods: ["POST", "GET"],
      child: {
        name: "{id}",
        methods: ["PUT", "GET", "DELETE"],
      },
    });

    this.createEndpoints(categoryService, apgw, {
      name: "category",
      methods: ["POST", "GET"],
      child: {
        name: "{id}",
        methods: ["PUT", "GET", "DELETE"],
      },
    });

    this.createEndpoints(dealsService, apgw, {
      name: "deals",
      methods: ["POST", "GET"],
      child: {
        name: "{id}",
        methods: ["PUT", "GET", "DELETE"],
      },
    });

    this.createEndpoints(imageService, apgw, {
      name: "uploader",
      methods: ["GET"],
    });

    this.createEndpoints(queueService, apgw, {
      name: "products-queue",
      methods: ["POST"],
    });
  }

  private createEndpoints(
    handler: IFunction,
    resource: RestApi,
    { name, methods, child }: ResourceType
  ) {
    const lambdaFunction = new LambdaIntegration(handler);
    const rootResource = resource.root.addResource(name);
    methods.map((item) => {
      rootResource.addMethod(item, lambdaFunction);
    });

    if (child) {
      const childResource = rootResource.addResource(child.name);
      child.methods.map((item) => {
        childResource.addMethod(item, lambdaFunction);
      });
    }
  }
}
