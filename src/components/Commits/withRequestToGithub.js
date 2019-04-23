import React from 'react';
import { gql, graphql } from 'react-apollo';

// 定义返回值
const RepoQuery : Function = gql`
query RepoQuery($owner: String!, $repo: String!, $commitsNumber: Int!) {
    // 组件可通过props.data.github.repo取出返回值
    github {
    repo(ownerUsername: $owner, name: $repo) {
        commits(limit: $commitsNumber) {
        sha
        message
        }
    }
    }
}`;

// 定义查询参数
const internalHoc = graphql(RepoQuery, {
    options: props => ({
        // 组件可通过props.data.variables取出查询参数
        variables: {
            owner: props.match.params.owner,
            repo: props.match.params.repo,
            commitsNumber: parseInt(props.location.state.commitsNumber)
        }
    }) 
})

export default function withRequestToGithub(Component){

    return class RequestHoC extends React.Component {

        state = {
            owner: null,
            repo: null,
            commitsNumber: null,
            variables: {}
        };

        wrapped = internalHoc(Component)

        render() {
            // console.log(this.res);
            const commitsNumber = this.props.location.state && this.props.location.state.commitsNumber || 0;
            const Wrapped = this.wrapped;
            
            return (
                <Wrapped
                    owner={this.props.match.params.owner}
                    repo={this.props.match.params.repo}
                    commitsNumber={commitsNumber}
                    {...this.props}
                />
                // , console.log(this.props.match.params.owner)
            );
        };
    }
}