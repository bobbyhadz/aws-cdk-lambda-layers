import {Construct} from "constructs";
import {
    InstanceClass,
    InstanceSize,
    InstanceType,
    IVpc,
    Peer,
    Port,
    SecurityGroup,
    SubnetType
} from "aws-cdk-lib/aws-ec2";
import {Credentials, DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion} from "aws-cdk-lib/aws-rds";

interface DatabaseProps {
    vpc: IVpc
    dbUser: string
}

export class Database extends Construct {
    public readonly db: DatabaseInstance

    constructor(scope: Construct, id: string, props: DatabaseProps) {
        super(scope, id);
        this.db = this.createDatabase(id, props.vpc, props.dbUser)
    }


    createDatabase = (databaseId: string, vpc: IVpc, dbUser: string): DatabaseInstance => {
        const dbSecurityGroup = new SecurityGroup(this, "DBSecurityGroup", {
            vpc: vpc,
            allowAllOutbound: true
        })

        dbSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(5432), "Allow db connections on 5432")

        return new DatabaseInstance(this, databaseId, {
            engine: DatabaseInstanceEngine.postgres({
                version: PostgresEngineVersion.VER_14_5
            }),
            instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
            vpc: vpc,
            vpcSubnets: {
                subnetType: SubnetType.PUBLIC
            },
            credentials: Credentials.fromGeneratedSecret(dbUser),
            securityGroups: [dbSecurityGroup],
            multiAz: false,
            databaseName: "prismaDb"
        })
    }
}
