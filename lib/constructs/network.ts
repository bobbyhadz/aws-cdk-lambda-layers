import {Construct} from "constructs";
import {aws_ec2} from "aws-cdk-lib";
import {IpAddresses, SubnetType} from "aws-cdk-lib/aws-ec2";

const vpcName = 'PostgresPrismaVpc';

export class Network extends Construct {
    public readonly vpc: aws_ec2.IVpc

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.vpc = new aws_ec2.Vpc(this, id, {
            vpcName: vpcName,
            ipAddresses: IpAddresses.cidr("10.0.0.0/16"),
            subnetConfiguration: [
                {
                    subnetType: SubnetType.PUBLIC,
                    cidrMask: 24,
                    name: `${vpcName}-public-subnet`
                },
                {
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                    cidrMask: 24,
                    name: `${vpcName}-private-egress-subnet`
                }
            ]
        })
    }
}
